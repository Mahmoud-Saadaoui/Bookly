class HttpError extends Error {
  constructor(message, statusCode, code = null) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
  }
}

module.exports = HttpError;
