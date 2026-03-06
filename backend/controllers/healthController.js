const mongoose = require('mongoose');
const logger = require('../utils/logger');

/**
 * Health check endpoint
 * Returns the status of the API and its dependencies
 */
exports.healthCheck = async (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    checks: {
      database: {
        status: 'unknown',
        responseTime: null
      },
      api: {
        status: 'up',
        version: require('../package.json').version,
        environment: process.env.NODE_ENV || 'development'
      }
    }
  };

  try {
    // Check database connection
    const dbStart = Date.now();
    await mongoose.connection.db.admin().ping();
    healthcheck.checks.database.responseTime = Date.now() - dbStart;
    healthcheck.checks.database.status = 'up';

    return res.status(200).json(healthcheck);
  } catch (error) {
    logger.error('Database health check failed:', error);
    healthcheck.checks.database.status = 'down';
    healthcheck.message = 'Degraded';
    return res.status(503).json(healthcheck);
  }
};

/**
 * Simple readiness probe
 */
exports.readinessCheck = (req, res) => {
  const isReady = mongoose.connection.readyState === 1;

  return res.status(isReady ? 200 : 503).json({
    status: isReady ? 'ready' : 'not ready',
    database: isReady ? 'connected' : 'disconnected'
  });
};

/**
 * Simple liveness probe
 */
exports.livenessCheck = (req, res) => {
  return res.status(200).json({
    status: 'alive',
    uptime: process.uptime()
  });
};
