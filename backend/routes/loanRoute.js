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
const {
  createLoanValidation,
  checkAvailabilityValidation,
  loanIdValidation,
  bookIdValidation
} = require('../validators/loanValidator');

// Create a new loan
router.post('/', auth.check, createLoanValidation, createLoan);

// Get all loans for a book (unavailable dates) - Public route
router.get('/book/:bookId', bookIdValidation, getBookLoanDates);

// Get user's loans
router.get('/user/all', auth.check, getUserLoans);

// Check if book is available for specific dates - Public route
router.get('/availability/:bookId', checkAvailabilityValidation, checkBookAvailability);

// Return a book
router.put('/return/:loanId', auth.check, loanIdValidation, returnBook);

// Get loan details
router.get('/:loanId', auth.check, loanIdValidation, getLoanDetail);

module.exports = router;
