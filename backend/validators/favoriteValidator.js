const { body, param } = require('express-validator');
const { validate } = require('./validate');

/**
 * Validation rules for adding to favorites
 */
const addToFavoritesValidation = [
  body('book')
    .notEmpty().withMessage('Book ID is required')
    .isMongoId().withMessage('Invalid book ID'),
  body('favorite')
    .notEmpty().withMessage('Favorite status is required')
    .isBoolean().withMessage('Favorite must be a boolean'),
  validate
];

/**
 * Validation rules for favorite ID parameter
 */
const favoriteIdValidation = [
  param('id')
    .isMongoId().withMessage('Invalid favorite ID'),
  validate
];

module.exports = {
  addToFavoritesValidation,
  favoriteIdValidation
};
