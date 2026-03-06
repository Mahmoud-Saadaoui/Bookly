/**
 * Centralized Error Handling Middleware
 * Prevents HTML stack traces from being exposed to clients
 */

const logger = require('../utils/logger');
const { internalErrorResponse, badRequestResponse } = require('../utils/apiResponse');

exports.notFound = (req, res, next) => {
  logger.warn('404 - Route not found', {
    path: req.originalUrl,
    method: req.method,
    ip: req.ip
  });

  return res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
};

exports.errorHandler = (err, req, res, next) => {
  // Log error for debugging
  logger.error('Request error', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.originalUrl,
    method: req.method,
    ip: req.ip
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    return badRequestResponse(res, 'Resource not found', {
      field: err.path,
      error: 'Invalid ID format'
    });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return badRequestResponse(res, 'Duplicate field value entered', {
      field,
      error: `${field} already exists`
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return badRequestResponse(res, 'Validation failed', {
      errors: messages
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }

  // Multer errors (file upload)
  if (err.name === 'MulterError') {
    return badRequestResponse(res, err.message);
  }

  // Express-validator errors
  if (err.array && typeof err.array === 'function') {
    return badRequestResponse(res, 'Validation failed', {
      errors: err.array()
    });
  }

  // Default error
  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
};
