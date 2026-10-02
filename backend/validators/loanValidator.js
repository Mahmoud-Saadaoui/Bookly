const { body, param, query, header } = require('express-validator');
const { validate } = require('./validate');

const MAX_LOAN_DURATION_DAYS = Number(process.env.MAX_LOAN_DURATION_DAYS) || 30;

const validateLoanDates = (loanDateValue, returnDateValue, { allowPast = false } = {}) => {
  const loanDate = new Date(loanDateValue);
  const returnDate = new Date(returnDateValue);

  if (Number.isNaN(loanDate.getTime()) || Number.isNaN(returnDate.getTime())) {
    throw new Error('Loan and return dates must be valid dates');
  }

  if (!allowPast && loanDate < new Date()) {
    throw new Error('Loan date cannot be in the past');
  }

  const duration = returnDate.getTime() - loanDate.getTime();
  if (duration <= 0) {
    throw new Error('Return date must be after loan date');
  }

  if (duration > MAX_LOAN_DURATION_DAYS * 24 * 60 * 60 * 1000) {
    throw new Error(`Loan duration cannot exceed ${MAX_LOAN_DURATION_DAYS} days`);
  }
};

/**
 * Validation rules for creating a loan
 */
const createLoanValidation = [
  body('bookId')
    .notEmpty().withMessage('Book ID is required')
    .isMongoId().withMessage('Invalid book ID'),
  body('loanDate')
    .notEmpty().withMessage('Loan date is required')
    .isISO8601().withMessage('Invalid loan date format')
     .custom((value, { req }) => {
       if (req.body.returnDate) {
         validateLoanDates(value, req.body.returnDate);
       }
       return true;
     }),
  body('returnDate')
    .notEmpty().withMessage('Return date is required')
     .isISO8601().withMessage('Invalid return date format')
     .custom((value, { req }) => {
       if (req.body.loanDate) {
         validateLoanDates(req.body.loanDate, value);
       }
       return true;
     }),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Notes must be less than 500 characters')
    .escape(),
  header('Idempotency-Key')
    .optional()
    .trim()
    .isLength({ min: 8, max: 128 }).withMessage('Idempotency key must be between 8 and 128 characters'),
  validate
];

/**
 * Validation rules for checking book availability
 */
const checkAvailabilityValidation = [
  param('bookId')
    .isMongoId().withMessage('Invalid book ID'),
  query('startDate')
    .notEmpty().withMessage('Start date is required')
    .isISO8601().withMessage('Invalid start date format'),
  query('endDate')
    .notEmpty().withMessage('End date is required')
    .isISO8601().withMessage('Invalid end date format')
    .custom((value, { req }) => {
      validateLoanDates(req.query.startDate, value, { allowPast: true });
      return true;
    }),
  validate
];

/**
 * Validation rules for loan ID parameter
 */
const loanIdValidation = [
  param('loanId')
    .isMongoId().withMessage('Invalid loan ID'),
  validate
];

/**
 * Validation rules for book ID parameter in loan routes
 */
const bookIdValidation = [
  param('bookId')
    .isMongoId().withMessage('Invalid book ID'),
  validate
];

module.exports = {
  createLoanValidation,
  checkAvailabilityValidation,
  loanIdValidation,
  bookIdValidation
};
