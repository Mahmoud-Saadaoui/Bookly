const { body, param } = require('express-validator');
const { validate } = require('./validate');

/**
 * Validation rules for creating a book
 */
const createBookValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters')
    .escape(),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10, max: 5000 }).withMessage('Description must be between 10 and 5000 characters')
    .escape(),
  body('category')
    .trim()
    .notEmpty().withMessage('Category is required')
    .isLength({ min: 2, max: 50 }).withMessage('Category must be between 2 and 50 characters')
    .escape(),
  body('author')
    .trim()
    .notEmpty().withMessage('Author is required')
    .isLength({ min: 2, max: 100 }).withMessage('Author must be between 2 and 100 characters')
    .escape(),
  body('language')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Language too long')
    .escape(),
  body('PublicationDate')
    .optional()
    .isISO8601().withMessage('Invalid date format'),
  validate
];

/**
 * Validation rules for updating a book
 */
const updateBookValidation = [
  param('id')
    .isMongoId().withMessage('Invalid book ID'),
  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('Title cannot be empty')
    .isLength({ max: 200 }).withMessage('Title too long')
    .escape(),
  body('description')
    .optional()
    .trim()
    .notEmpty().withMessage('Description cannot be empty')
    .isLength({ max: 5000 }).withMessage('Description too long')
    .escape(),
  body('category')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Category too long')
    .escape(),
  body('author')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Author too long')
    .escape(),
  body('language')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Language too long')
    .escape(),
  body('PublicationDate')
    .optional()
    .isISO8601().withMessage('Invalid date format'),
  validate
];

/**
 * Validation rules for book ID parameter
 */
const bookIdValidation = [
  param('id')
    .isMongoId().withMessage('Invalid book ID'),
  validate
];

/**
 * Validation rules for adding a review
 */
const addReviewValidation = [
  param('id')
    .isMongoId().withMessage('Invalid book ID'),
  body('comment')
    .trim()
    .notEmpty().withMessage('Comment is required')
    .isLength({ min: 1, max: 1000 }).withMessage('Comment must be between 1 and 1000 characters')
    .escape(),
  body('rate')
    .notEmpty().withMessage('Rate is required')
    .isFloat({ min: 0, max: 5 }).withMessage('Rate must be between 0 and 5'),
  validate
];

module.exports = {
  createBookValidation,
  updateBookValidation,
  bookIdValidation,
  addReviewValidation
};
