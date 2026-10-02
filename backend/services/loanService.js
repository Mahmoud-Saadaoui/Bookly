const mongoose = require('mongoose');
const Loan = require('../models/loan');
const Book = require('../models/book');
const User = require('../models/user');
const HttpError = require('../utils/httpError');

const ACTIVE_LOAN_STATUS = 'active';

const createLoan = async ({ userId, bookId, loanDate, returnDate, notes, idempotencyKey }) => {
  const session = await mongoose.startSession();
  let result;

  try {
    await session.withTransaction(async () => {
      if (idempotencyKey) {
        const previousLoan = await Loan.findOne({ user: userId, idempotencyKey })
          .session(session)
          .lean();

        if (previousLoan) {
          result = { loan: previousLoan, reused: true };
          return;
        }
      }

      const user = await User.findById(userId)
        .select('_id')
        .session(session)
        .lean();

      const book = await Book.findOne({ _id: bookId, isDeleted: { $ne: true } })
        .select('_id')
        .session(session)
        .lean();

      if (!user) {
        throw new HttpError('User not found', 404, 'USER_NOT_FOUND');
      }

      if (!book) {
        throw new HttpError('Book not found', 404, 'BOOK_NOT_FOUND');
      }

      // Updating the resource serializes reservations for the same book.
      await Book.updateOne(
        { _id: book._id, isDeleted: { $ne: true } },
        { $inc: { reservationVersion: 1 } },
        { session }
      );

      const overlappingLoan = await Loan.findOne({
        book: book._id,
        status: ACTIVE_LOAN_STATUS,
        loanDate: { $lt: returnDate },
        returnDate: { $gt: loanDate }
      })
        .select('_id')
        .session(session)
        .lean();

      if (overlappingLoan) {
        throw new HttpError(
          'Book is not available for the selected dates',
          409,
          'BOOK_UNAVAILABLE'
        );
      }

      const [loan] = await Loan.create([{
        user: user._id,
        book: book._id,
        loanDate,
        returnDate,
        notes,
        status: ACTIVE_LOAN_STATUS,
        ...(idempotencyKey ? { idempotencyKey } : {})
      }], { session });

      loan.set('idempotencyKey', undefined);

      result = { loan, reused: false };
    });
  } catch (error) {
    // A concurrent retry with the same key may win the unique index race.
    if (error.code === 11000 && idempotencyKey) {
      const previousLoan = await Loan.findOne({ user: userId, idempotencyKey }).lean();
      if (previousLoan) {
        return { loan: previousLoan, reused: true };
      }
    }

    throw error;
  } finally {
    await session.endSession();
  }

  return result;
};

const returnLoan = async ({ loanId, userId }) => {
  const session = await mongoose.startSession();
  let returnedLoan;

  try {
    await session.withTransaction(async () => {
      const loan = await Loan.findById(loanId).session(session);

      if (!loan) {
        throw new HttpError('Loan not found', 404, 'LOAN_NOT_FOUND');
      }

      if (loan.user.toString() !== userId.toString()) {
        throw new HttpError('Not authorized to return this loan', 403, 'LOAN_FORBIDDEN');
      }

      if (loan.status === 'returned' || loan.actualReturnDate) {
        throw new HttpError('This book has already been returned', 400, 'LOAN_ALREADY_RETURNED');
      }

      loan.actualReturnDate = new Date();
      loan.status = 'returned';
      await loan.save({ session });

      // Serialize a return against a reservation starting at the same time.
      await Book.updateOne(
        { _id: loan.book },
        { $inc: { reservationVersion: 1 } },
        { session }
      );

      returnedLoan = loan;
    });
  } finally {
    await session.endSession();
  }

  return returnedLoan;
};

module.exports = {
  ACTIVE_LOAN_STATUS,
  createLoan,
  returnLoan
};
