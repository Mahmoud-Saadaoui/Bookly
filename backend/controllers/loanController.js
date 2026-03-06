const Loan = require('../models/loan');
const { asyncHandler } = require('../middlewares/asyncHandler');
const {
  createdResponse,
  successResponse,
  notFoundResponse,
  badRequestResponse,
  forbiddenResponse
} = require('../utils/apiResponse');

// Create a new loan request
exports.createLoan = asyncHandler(async (req, res) => {
    const { bookId, loanDate, returnDate, notes } = req.body;
    const userId = req.userId;

    if (!bookId || !loanDate || !returnDate) {
        return badRequestResponse(res, 'Book ID, loan date, and return date are required');
    }

    // Check if loan dates are valid
    const start = new Date(loanDate);
    const end = new Date(returnDate);
    if (start >= end) {
        return badRequestResponse(res, 'Return date must be after loan date');
    }

    // Check for overlapping loans
    const existingLoan = await Loan.findOne({
        book: bookId,
        status: { $in: ['active', 'overdue'] },
        $or: [
            { loanDate: { $lt: end }, returnDate: { $gt: start } }
        ]
    });

    if (existingLoan) {
        return badRequestResponse(res, 'Book is not available for the selected dates');
    }

    const loan = await Loan.create({
        user: userId,
        book: bookId,
        loanDate: start,
        returnDate: end,
        notes: notes || '',
        status: 'active'
    });

    return createdResponse(res, loan, 'Loan created successfully');
});

// Get all loans for a book (to check availability)
exports.getBookLoanDates = asyncHandler(async (req, res) => {
    const { bookId } = req.params;

    const loans = await Loan.find({
        book: bookId,
        status: { $in: ['active', 'overdue'] }
    }).select('loanDate returnDate');

    const unavailableDates = loans.map(loan => ({
        startDate: loan.loanDate,
        endDate: loan.returnDate
    }));

    return successResponse(res, unavailableDates, 'Loan dates retrieved');
});

// Get user's loans
exports.getUserLoans = asyncHandler(async (req, res) => {
    const userId = req.userId;

    const loans = await Loan.find({ user: userId })
        .populate('book', 'title image author')
        .sort({ createdAt: -1 });

    return successResponse(res, loans, 'User loans retrieved');
});

// Return a book
exports.returnBook = asyncHandler(async (req, res) => {
    const { loanId } = req.params;
    const userId = req.userId;

    const loan = await Loan.findById(loanId);

    if (!loan) {
        return notFoundResponse(res, 'Loan');
    }

    // Verify loan belongs to user
    if (loan.user.toString() !== userId.toString()) {
        return forbiddenResponse(res, 'Not authorized to return this loan');
    }

    if (loan.status === 'returned') {
        return badRequestResponse(res, 'This book has already been returned');
    }

    const now = new Date();
    loan.actualReturnDate = now;
    loan.status = now > loan.returnDate ? 'overdue' : 'returned';

    await loan.save();

    return successResponse(res, loan, 'Book returned successfully');
});

// Get loan details
exports.getLoanDetail = asyncHandler(async (req, res) => {
    const { loanId } = req.params;

    const loan = await Loan.findById(loanId)
        .populate('user', 'name email')
        .populate('book', 'title author image');

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

    const overlappingLoan = await Loan.findOne({
        book: bookId,
        status: { $in: ['active', 'overdue'] },
        $or: [
            { loanDate: { $lt: end }, returnDate: { $gt: start } }
        ]
    });

    return successResponse(res, {
        isAvailable: !overlappingLoan
    }, 'Availability checked');
});
