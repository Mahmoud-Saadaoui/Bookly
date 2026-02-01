const express = require('express');
const router = express.Router();
const {
    createLoan,
    getBookLoanDates,
    getUserLoans,
    returnBook,
    getLoanDetail,
    checkBookAvailability
} = require('../controllers/loanController');
const auth = require('../middlewares/auth');

// Create a new loan
router.post('/', auth.check, createLoan);

// Get all loans for a book (unavailable dates)
router.get('/book/:bookId', getBookLoanDates);

// Get user's loans
router.get('/user/all', auth.check, getUserLoans);

// Check if book is available for specific dates
router.get('/availability/:bookId', checkBookAvailability);

// Return a book
router.put('/return/:loanId', auth.check, returnBook);

// Get loan details
router.get('/:loanId', auth.check, getLoanDetail);

module.exports = router;
