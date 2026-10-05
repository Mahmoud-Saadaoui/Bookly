const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { authorize } = require('../middlewares/role');
const { quoteBooking, createBooking, getMyBookings, updateBookingStatus } = require('../controllers/bookingController');

router.post('/quote', quoteBooking);
router.post('/', auth.check, authorize('customer', 'admin', 'agent'), createBooking);
router.get('/mine', auth.check, authorize('customer', 'admin', 'agent'), getMyBookings);
router.patch('/:id/status', auth.check, authorize('admin', 'agent', 'fleet_manager'), updateBookingStatus);

module.exports = router;
