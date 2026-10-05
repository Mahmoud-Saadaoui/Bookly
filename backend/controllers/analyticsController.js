const Vehicle = require('../models/vehicle');
const Booking = require('../models/booking');
const { asyncHandler } = require('../middlewares/asyncHandler');
const { successResponse, badRequestResponse, paginatedResponse } = require('../utils/apiResponse');
const { parsePagination, getPaginationMeta } = require('../utils/pagination');

const rangeDates = (range = '30d') => {
  const match = /^([0-9]+)(d|m)$/.exec(range);
  if (!match) return null;
  const amount = Number(match[1]);
  const days = match[2] === 'm' ? amount * 30 : amount;
  const to = new Date();
  const from = new Date(to.getTime() - days * 86400000);
  return { from, to, days };
};

const getOverview = asyncHandler(async (req, res) => {
  const dates = rangeDates(req.query.range || '30d');
  if (!dates) return badRequestResponse(res, 'Invalid analytics range');
  const bookingFilter = {
    startAt: { $gte: dates.from, $lt: dates.to },
    status: { $in: ['confirmed', 'active', 'completed'] }
  };
  const [bookings, fleetTotal, activeFleet, maintenanceFleet] = await Promise.all([
    Booking.find(bookingFilter).select('vehicle startAt endAt pricing').lean(),
    Vehicle.countDocuments({ isDeleted: false, status: { $ne: 'retired' } }),
    Vehicle.countDocuments({ isDeleted: false, status: { $in: ['available', 'reserved', 'rented'] } }),
    Vehicle.countDocuments({ isDeleted: false, status: 'maintenance' })
  ]);
  const revenueCents = bookings.reduce((sum, booking) => sum + (booking.pricing?.totalCents || 0), 0);
  const rentedDays = bookings.reduce((sum, booking) => {
    const start = Math.max(booking.startAt.getTime(), dates.from.getTime());
    const end = Math.min(booking.endAt.getTime(), dates.to.getTime());
    return sum + Math.max(0, Math.ceil((end - start) / 86400000));
  }, 0);
  const availableDays = Math.max(1, fleetTotal * dates.days);
  return successResponse(res, {
    range: { from: dates.from, to: dates.to, days: dates.days },
    revenueCents,
    bookings: bookings.length,
    averageBookingCents: bookings.length ? Math.round(revenueCents / bookings.length) : 0,
    occupancyRate: Number(((rentedDays / availableDays) * 100).toFixed(1)),
    fleetTotal,
    activeFleet,
    maintenanceFleet,
    rentedDays,
    availableDays
  }, 'Analytics overview retrieved successfully');
});

const getProfitability = asyncHandler(async (req, res) => {
  const dates = rangeDates(req.query.range || '90d');
  if (!dates) return badRequestResponse(res, 'Invalid analytics range');

  // Pagination: extract page, limit, skip from query string
  const { page, limit, skip } = parsePagination(req.query);

  const vehicleFilter = { isDeleted: false, status: { $ne: 'retired' } };

  // Fetch paginated vehicles + total in parallel
  const [vehicles, total] = await Promise.all([
    Vehicle.find(vehicleFilter).lean(),
    Vehicle.countDocuments(vehicleFilter)
  ]);

  const bookings = await Booking.find({ startAt: { $gte: dates.from, $lt: dates.to }, status: { $in: ['confirmed', 'active', 'completed'] } }).select('vehicle pricing').lean();
  const revenueByVehicle = new Map();
  bookings.forEach((booking) => revenueByVehicle.set(String(booking.vehicle), (revenueByVehicle.get(String(booking.vehicle)) || 0) + (booking.pricing?.totalCents || 0)));

  // Calculate profitability only for vehicles on current page
  const result = vehicles.map((vehicle) => {
    const revenueCents = revenueByVehicle.get(String(vehicle._id)) || 0;
    const costsCents = (vehicle.maintenanceCostCents || 0) + ((vehicle.ownershipCostCentsPerDay || 0) * dates.days);
    const marginCents = revenueCents - costsCents;
    return { vehicleId: vehicle._id, name: `${vehicle.make} ${vehicle.model}`, category: vehicle.category, revenueCents, costsCents, marginCents, marginRate: revenueCents ? Number(((marginCents / revenueCents) * 100).toFixed(1)) : 0 };
  }).sort((a, b) => b.marginCents - a.marginCents);

  return paginatedResponse(res, result, getPaginationMeta(page, limit, total), 'Vehicle profitability retrieved successfully');
});

module.exports = { getOverview, getProfitability };
