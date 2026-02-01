const Loan = require('../models/loan');
const { asyncHandler } = require('../middlewares/asyncHandler');

// Create a new loan request
exports.createLoan = asyncHandler(async (req, res) => {
    const { bookId, loanDate, returnDate, notes } = req.body;
    const userId = req.user._id;

    if (!bookId || !loanDate || !returnDate) {
        return res.status(400).json({
            success: false,
            message: "Book ID, loan date, and return date are required"
        });
    }

    // Check if loan dates are valid
    const start = new Date(loanDate);
    const end = new Date(returnDate);
    if (start >= end) {
        return res.status(400).json({
            success: false,
            message: "Return date must be after loan date"
        });
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
        return res.status(400).json({
            success: false,
            message: "Book is not available for the selected dates"
        });
    }

    const loan = await Loan.create({
        user: userId,
        book: bookId,
        loanDate: start,
        returnDate: end,
        notes: notes || '',
        status: 'active'
    });

    res.status(201).json({
        success: true,
        message: "Loan created successfully",
        data: loan
    });
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

    res.status(200).json({
        success: true,
        data: unavailableDates
    });
});

// Get user's loans
exports.getUserLoans = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const loans = await Loan.find({ user: userId })
        .populate('book', 'title image author')
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        data: loans
    });
});

// Return a book
exports.returnBook = asyncHandler(async (req, res) => {
    const { loanId } = req.params;
    const userId = req.user._id;

    const loan = await Loan.findById(loanId);

    if (!loan) {
        return res.status(404).json({
            success: false,
            message: "Loan not found"
        });
    }

    // Verify loan belongs to user
    if (loan.user.toString() !== userId.toString()) {
        return res.status(403).json({
            success: false,
            message: "Not authorized to return this loan"
        });
    }

    if (loan.status === 'returned') {
        return res.status(400).json({
            success: false,
            message: "This book has already been returned"
        });
    }

    const now = new Date();
    loan.actualReturnDate = now;
    loan.status = now > loan.returnDate ? 'overdue' : 'returned';

    await loan.save();

    res.status(200).json({
        success: true,
        message: "Book returned successfully",
        data: loan
    });
});

// Get loan details
exports.getLoanDetail = asyncHandler(async (req, res) => {
    const { loanId } = req.params;

    const loan = await Loan.findById(loanId)
        .populate('user', 'name email')
        .populate('book', 'title author image');

    if (!loan) {
        return res.status(404).json({
            success: false,
            message: "Loan not found"
        });
    }

    res.status(200).json({
        success: true,
        data: loan
    });
});

// Get book availability status
exports.checkBookAvailability = asyncHandler(async (req, res) => {
    const { bookId } = req.params;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        return res.status(400).json({
            success: false,
            message: "Start date and end date are required"
        });
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

    res.status(200).json({
        success: true,
        isAvailable: !overlappingLoan
    });
});
