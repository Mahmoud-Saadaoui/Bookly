const { body, param, query } = require('express-validator');
const { validate } = require('./validate');

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
      const loanDate = new Date(value);
      const returnDate = new Date(req.body.returnDate);
      if (loanDate >= returnDate) {
        throw new Error('Loan date must be before return date');
      }
      return true;
    }),
  body('returnDate')
    .notEmpty().withMessage('Return date is required')
    .isISO8601().withMessage('Invalid return date format'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Notes must be less than 500 characters')
    .escape(),
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
      const startDate = new Date(req.query.startDate);
      const endDate = new Date(value);
      if (startDate >= endDate) {
        throw new Error('End date must be after start date');
      }
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
