const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { authorize } = require('../middlewares/role');
const { getVehicles, createVehicle, updateVehicleStatus } = require('../controllers/vehicleController');

router.get('/', getVehicles);
router.post('/', auth.check, authorize('admin', 'fleet_manager'), createVehicle);
router.patch('/:id/status', auth.check, authorize('admin', 'fleet_manager', 'agent'), updateVehicleStatus);

module.exports = router;
