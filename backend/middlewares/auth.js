const jwtHelpers = require('../utils/jwtHelpers');
const logger = require('../utils/logger');
const { unauthorizedResponse } = require('../utils/apiResponse');

exports.check = (req, res, next) => {
  let token = req.headers['authorization'];
  // Authorization: Bearer token
  token = token?.replace('Bearer', '')?.trim();

  const payload = jwtHelpers.verify(token);

  if (payload) {
    req.userId = payload.sub;
    return next();
  }

  logger.warn('Unauthorized access attempt', {
    ip: req.ip,
    path: req.path
  });

  return unauthorizedResponse(res, 'Unauthorized!');
};
