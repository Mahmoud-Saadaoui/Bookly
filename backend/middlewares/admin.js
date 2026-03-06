const User = require('../models/user');
const logger = require('../utils/logger');
const { forbiddenResponse } = require('../utils/apiResponse');

exports.check = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      logger.warn('Admin check failed - user not found', { userId: req.userId });
      return forbiddenResponse(res, 'User not found');
    }

    if (user.isAdmin) {
      return next();
    }

    logger.warn('Admin check failed - insufficient permissions', {
      userId: req.userId,
      path: req.path
    });

    return forbiddenResponse(res, 'Admin access required');
  } catch (error) {
    logger.error('Error in admin middleware', { error: error.message });
    return forbiddenResponse(res, 'Failed to verify admin status');
  }
};
