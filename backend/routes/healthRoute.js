const express = require('express');
const router = express.Router();
const {
  healthCheck,
  readinessCheck,
  livenessCheck
} = require('../controllers/healthController');

// Health check endpoint
router.get('/', healthCheck);

// Readiness probe (for Kubernetes/Docker)
router.get('/ready', readinessCheck);

// Liveness probe (for Kubernetes/Docker)
router.get('/live', livenessCheck);

module.exports = router;
