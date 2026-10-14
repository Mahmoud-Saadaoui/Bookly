const { body } = require('express-validator');

/**
 * Validation rules for branches
 * Used by branchController
 */
const branchRules = {
  create: [
    body('name')
      .notEmpty().withMessage('Name is required')
      .trim()
      .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
    body('code')
      .notEmpty().withMessage('Code is required')
      .trim()
      .isLength({ min: 2, max: 10 }).withMessage('Code must be between 2 and 10 characters'),
    body('address.city')
      .notEmpty().withMessage('City is required')
      .trim()
      .isLength({ max: 100 }).withMessage('City cannot exceed 100 characters'),
    body('address.street')
      .optional({ values: 'falsy' })
      .trim()
      .isLength({ max: 200 }).withMessage('Street cannot exceed 200 characters'),
    body('address.postalCode')
      .optional({ values: 'falsy' })
      .trim()
      .isLength({ max: 20 }).withMessage('Postal code cannot exceed 20 characters'),
    body('address.country')
      .optional({ values: 'falsy' })
      .trim()
      .isLength({ min: 2, max: 2 }).withMessage('Country must be a 2-letter ISO code'),
    body('phone')
      .optional({ values: 'falsy' })
      .trim()
      .isLength({ max: 30 }).withMessage('Phone cannot exceed 30 characters'),
    body('email')
      .optional({ values: 'falsy' })
      .trim()
      .isEmail().withMessage('Email must be valid')
      .normalizeEmail()
  ],

  update: [
    body('name')
      .optional()
      .notEmpty().withMessage('Name cannot be empty')
      .trim()
      .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
    body('code')
      .optional()
      .notEmpty().withMessage('Code cannot be empty')
      .trim()
      .isLength({ min: 2, max: 10 }).withMessage('Code must be between 2 and 10 characters'),
    body('address.city')
      .optional()
      .notEmpty().withMessage('City cannot be empty')
      .trim()
      .isLength({ max: 100 }).withMessage('City cannot exceed 100 characters'),
    body('address.street')
      .optional({ nullable: true, checkFalsy: true })
      .trim()
      .isLength({ max: 200 }).withMessage('Street cannot exceed 200 characters'),
    body('address.postalCode')
      .optional({ nullable: true, checkFalsy: true })
      .trim()
      .isLength({ max: 20 }).withMessage('Postal code cannot exceed 20 characters'),
    body('address.country')
      .optional({ nullable: true, checkFalsy: true })
      .trim()
      .isLength({ min: 2, max: 2 }).withMessage('Country must be a 2-letter ISO code'),
    body('phone')
      .optional({ nullable: true, checkFalsy: true })
      .trim()
      .isLength({ max: 30 }).withMessage('Phone cannot exceed 30 characters'),
    body('email')
      .optional({ nullable: true, checkFalsy: true })
      .trim()
      .isEmail().withMessage('Email must be valid')
      .normalizeEmail(),
    body('isActive')
      .optional()
      .isBoolean().withMessage('isActive must be a boolean')
  ]
};

module.exports = branchRules;
