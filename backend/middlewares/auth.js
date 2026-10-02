const jwtHelpers = require('../utils/jwtHelpers');
const mongoose = require('mongoose');
const logger = require('../utils/logger');
const { unauthorizedResponse } = require('../utils/apiResponse');

exports.check = (req, res, next) => {
  const authorization = req.get('authorization')?.trim();
  const [scheme, token] = authorization?.split(/\s+/) || [];

  if (scheme !== 'Bearer' || !token) {
    logger.warn('Unauthorized access attempt', {
      ip: req.ip,
      path: req.path
    });
    return unauthorizedResponse(res, 'Unauthorized');
  }

  const payload = jwtHelpers.verify(token);

  if (payload?.sub && mongoose.isValidObjectId(payload.sub)) {
    req.userId = payload.sub;
    return next();
  }

  logger.warn('Unauthorized access attempt', {
    ip: req.ip,
    path: req.path
  });

  return unauthorizedResponse(res, 'Unauthorized');
};
