const express = require('express');
const { successResponse } = require('../utils/apiResponse');

const router = express.Router();

router.get('/', (req, res) => {
  const maxLoanDurationDays = Number(process.env.MAX_LOAN_DURATION_DAYS) || 30;

  return successResponse(res, {
    maxLoanDurationDays,
  }, 'Public application configuration retrieved');
});

module.exports = router;
