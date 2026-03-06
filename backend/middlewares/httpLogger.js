const morgan = require('morgan');
const logger = require('../utils/logger');
const fs = require('fs');
const path = require('path');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Create a write stream for Morgan
const accessLogStream = fs.createWriteStream(
  path.join(logsDir, 'access.log'),
  { flags: 'a' }
);

// Morgan tokens
morgan.token('user-id', (req) => req.userId || 'anonymous');
morgan.token('request-id', (req) => req.id || 'N/A');

// Define custom format for Morgan
const morganFormat = ':request-id | :date[iso] | :method :url | :status | :response-time ms | :user-id | :remote-addr';

// Middleware for HTTP request logging
const httpLogger = morgan(morganFormat, {
  stream: accessLogStream,
  skip: (req, res) => {
    // Skip logging for health checks in production
    return process.env.NODE_ENV === 'production' && req.path === '/health';
  }
});

// Also log to console in development
if (process.env.NODE_ENV !== 'production') {
  morgan.token('user-id', (req) => req.userId || 'anonymous');
  morgan.token('request-id', (req) => req.id || 'N/A');

  const consoleFormat = '[:date[iso]] :method :url :status :response-time ms';
  const consoleLogger = morgan(consoleFormat);

  // Combine both loggers
  module.exports = (req, res, next) => {
    httpLogger(req, res, () => {});
    consoleLogger(req, res, next);
  };
} else {
  module.exports = httpLogger;
}

// Export the logger as well for use in other files
module.exports.logger = logger;
module.exports.httpLogger = httpLogger;
