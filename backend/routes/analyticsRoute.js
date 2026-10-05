const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { authorize } = require('../middlewares/role');
const { getOverview, getProfitability } = require('../controllers/analyticsController');

router.use(auth.check, authorize('admin', 'fleet_manager', 'finance_manager'));
router.get('/overview', getOverview);
router.get('/profitability', getProfitability);

module.exports = router;
