/**
 * Standardized API Response Helper
 * Provides consistent response format across all endpoints
 */

/**
 * Success response
 * @param {Response} res - Express response object
 * @param {*} data - Response data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code (default: 200)
 */
const successResponse = (res, data = null, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

/**
 * Error response
 * @param {Response} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 500)
 * @param {*} errors - Additional error details
 */
const errorResponse = (res, message = 'An error occurred', statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

/**
 * Paginated response
 * @param {Response} res - Express response object
 * @param {Array} data - Array of items
 * @param {Object} pagination - Pagination metadata
 * @param {string} message - Success message
 */
const paginatedResponse = (res, data, pagination, message = 'Success') => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      pages: pagination.pages
    }
  });
};

/**
 * Created response (201)
 * @param {Response} res - Express response object
 * @param {*} data - Created resource data
 * @param {string} message - Success message
 */
const createdResponse = (res, data, message = 'Resource created successfully') => {
  return successResponse(res, data, message, 201);
};

/**
 * No content response (204)
 * @param {Response} res - Express response object
 */
const noContentResponse = (res) => {
  return res.status(204).send();
};

/**
 * Not found response (404)
 * @param {Response} res - Express response object
 * @param {string} resource - Resource name
 */
const notFoundResponse = (res, resource = 'Resource') => {
  return errorResponse(res, `${resource} not found`, 404);
};

/**
 * Unauthorized response (401)
 * @param {Response} res - Express response object
 * @param {string} message - Error message
 */
const unauthorizedResponse = (res, message = 'Unauthorized') => {
  return errorResponse(res, message, 401);
};

/**
 * Forbidden response (403)
 * @param {Response} res - Express response object
 * @param {string} message - Error message
 */
const forbiddenResponse = (res, message = 'Forbidden') => {
  return errorResponse(res, message, 403);
};

/**
 * Bad request response (400)
 * @param {Response} res - Express response object
 * @param {string} message - Error message
 * @param {*} errors - Validation errors
 */
const badRequestResponse = (res, message = 'Bad request', errors = null) => {
  return errorResponse(res, message, 400, errors);
};

/**
 * Conflict response (409)
 * @param {Response} res - Express response object
 * @param {string} message - Error message
 */
const conflictResponse = (res, message = 'Resource conflict') => {
  return errorResponse(res, message, 409);
};

/**
 * Internal error response (500)
 * @param {Response} res - Express response object
 * @param {string} message - Error message
 */
const internalErrorResponse = (res, message = 'Internal server error') => {
  return errorResponse(res, message, 500);
};

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse,
  createdResponse,
  noContentResponse,
  notFoundResponse,
  unauthorizedResponse,
  forbiddenResponse,
  badRequestResponse,
  conflictResponse,
  internalErrorResponse
};
