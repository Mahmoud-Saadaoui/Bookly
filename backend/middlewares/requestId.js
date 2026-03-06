const crypto = require('crypto');

/**
 * Middleware to add unique request ID to each request
 * Helps with tracing requests through logs
 */
exports.requestId = (req, res, next) => {
  req.id = req.headers['x-request-id'] || crypto.randomUUID();
  res.setHeader('X-Request-ID', req.id);
  next();
};
