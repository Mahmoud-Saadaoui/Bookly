const Loan = require('../models/loan');
const Book = require('../models/book');
const { asyncHandler } = require('../middlewares/asyncHandler');
const { createLoan: createLoanTransaction, returnLoan: returnLoanTransaction } = require('../services/loanService');
const {
  createdResponse,
  successResponse,
  notFoundResponse,
  badRequestResponse,
  paginatedResponse
} = require('../utils/apiResponse');

const MAX_DATE_RANGES = 500;

// Create a new loan request
exports.createLoan = asyncHandler(async (req, res) => {
    const { bookId, loanDate, returnDate, notes } = req.body;
    const userId = req.userId;

    if (!bookId || !loanDate || !returnDate) {
        return badRequestResponse(res, 'Book ID, loan date, and return date are required');
    }

    // Date format and business rules are enforced by the validator and schema.
    const start = new Date(loanDate);
    const end = new Date(returnDate);
    const idempotencyKey = req.get('Idempotency-Key')?.trim() || null;

    const result = await createLoanTransaction({
        userId,
        bookId,
        loanDate: start,
        returnDate: end,
        notes: notes || '',
        idempotencyKey
    });

    if (result.reused) {
        return successResponse(res, result.loan, 'Loan already created');
    }

    return createdResponse(res, result.loan, 'Loan created successfully');
});

// Get all loans for a book (to check availability)
exports.getBookLoanDates = asyncHandler(async (req, res) => {
    const { bookId } = req.params;
    const requestedLimit = parseInt(req.query?.limit, 10) || MAX_DATE_RANGES;
    const limit = Math.min(Math.max(requestedLimit, 1), MAX_DATE_RANGES);

    const bookExists = await Book.exists({ _id: bookId, isDeleted: { $ne: true } });
    if (!bookExists) {
        return notFoundResponse(res, 'Book');
    }

    const loans = await Loan.find({
        book: bookId,
        status: 'active'
    }).select('loanDate returnDate')
        .sort({ loanDate: 1, _id: 1 })
        .limit(limit)
        .lean();

    const unavailableDates = loans.map(loan => ({
        startDate: loan.loanDate,
        endDate: loan.returnDate
    }));

    return successResponse(res, unavailableDates, 'Loan dates retrieved');
});

// Get user's loans
exports.getUserLoans = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const page = Math.min(Math.max(parseInt(req.query?.page, 10) || 1, 1), 10000);
    const requestedLimit = parseInt(req.query?.limit, 10) || 20;
    const limit = Math.min(Math.max(requestedLimit, 1), 50);
    const skip = (page - 1) * limit;

    const [loans, total] = await Promise.all([
        Loan.find({ user: userId })
            .populate('book', 'title image author')
            .sort({ createdAt: -1, _id: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Loan.countDocuments({ user: userId })
    ]);

    return paginatedResponse(
        res,
        loans,
        { page, limit, total, pages: Math.ceil(total / limit) },
        'User loans retrieved'
    );
});

// Return a book
exports.returnBook = asyncHandler(async (req, res) => {
    const { loanId } = req.params;
    const userId = req.userId;

    const loan = await returnLoanTransaction({ loanId, userId });
    return successResponse(res, loan, 'Book returned successfully');
});

// Get loan details
exports.getLoanDetail = asyncHandler(async (req, res) => {
    const { loanId } = req.params;

    const loan = await Loan.findOne({ _id: loanId, user: req.userId })
        .populate('user', 'name email')
        .populate('book', 'title author image')
        .lean();

    if (!loan) {
        return notFoundResponse(res, 'Loan');
    }

    return successResponse(res, loan, 'Loan details retrieved');
});

// Get book availability status
exports.checkBookAvailability = asyncHandler(async (req, res) => {
    const { bookId } = req.params;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        return badRequestResponse(res, 'Start date and end date are required');
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start >= end) {
        return badRequestResponse(res, 'End date must be after start date');
    }

    const bookExists = await Book.exists({ _id: bookId, isDeleted: { $ne: true } });
    if (!bookExists) {
        return notFoundResponse(res, 'Book');
    }

    const overlappingLoan = await Loan.findOne({
        book: bookId,
        status: 'active',
        loanDate: { $lt: end },
        returnDate: { $gt: start }
    });

    return successResponse(res, {
        isAvailable: !overlappingLoan
    }, 'Availability checked');
});
