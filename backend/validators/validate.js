/**
 * Express Validator Middleware
 * Centralized validation handler to avoid code duplication
 */

const { validationResult } = require('express-validator');

/**
 * Validation middleware factory
 * Returns middleware that checks for validation errors
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }

  next();
};

module.exports = { validate };
