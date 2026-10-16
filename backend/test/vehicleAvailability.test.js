const { test } = require('node:test');
const assert = require('node:assert/strict');

const Vehicle = require('../models/vehicle');
const Booking = require('../models/booking');
const { getVehicleById, getVehicleAvailability } = require('../controllers/vehicleController');

/**
 * Unit tests for the public single-vehicle and availability endpoints.
 * Mongoose methods are stubbed so no MongoDB is required.
 */

const VALID_ID = '507f1f77bcf86cd799439011';

const originalVehicleFindOne = Vehicle.findOne;
const originalBookingFind = Booking.find;

const makeResponse = () => ({
  statusCode: null,
  body: null,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(body) {
    this.body = body;
    return this;
  },
});

const call = async (handler, req) => {
  const res = makeResponse();
  const errors = [];
  handler(req, res, (error) => errors.push(error));
  await new Promise((resolve) => setImmediate(resolve));
  if (errors.length) throw errors[0];
  return res;
};

const restore = () => {
  Vehicle.findOne = originalVehicleFindOne;
  Booking.find = originalBookingFind;
};

// --- GET /vehicles/:id ---------------------------------------------------

test('getVehicleById returns the vehicle with its branch populated', async () => {
  let capturedFilter;
  const doc = { _id: VALID_ID, make: 'Tesla', model: 'Model 3', branch: { name: 'Paris' } };
  Vehicle.findOne = (filter) => {
    capturedFilter = filter;
    const chain = {
      populate: () => chain,
      lean: () => Promise.resolve(doc),
    };
    return chain;
  };

  try {
    const res = await call(getVehicleById, { params: { id: VALID_ID } });

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.data.make, 'Tesla');
    assert.equal(capturedFilter.isDeleted, false);
    assert.deepEqual(capturedFilter.status, { $ne: 'retired' });
  } finally {
    restore();
  }
});

test('getVehicleById returns 404 for an invalid id', async () => {
  try {
    const res = await call(getVehicleById, { params: { id: 'not-an-id' } });
    assert.equal(res.statusCode, 404);
    assert.equal(res.body.success, false);
  } finally {
    restore();
  }
});

test('getVehicleById returns 404 when the vehicle does not exist', async () => {
  Vehicle.findOne = () => {
    const chain = { populate: () => chain, lean: () => Promise.resolve(null) };
    return chain;
  };

  try {
    const res = await call(getVehicleById, { params: { id: VALID_ID } });
    assert.equal(res.statusCode, 404);
  } finally {
    restore();
  }
});

// --- GET /vehicles/:id/availability --------------------------------------

test('getVehicleAvailability returns active future booked ranges', async () => {
  let capturedFilter;
  const ranges = [
    { startAt: new Date('2030-01-10T10:00:00Z'), endAt: new Date('2030-01-12T10:00:00Z') },
  ];
  Booking.find = (filter) => {
    capturedFilter = filter;
    const chain = {
      select: () => chain,
      sort: () => chain,
      lean: () => Promise.resolve(ranges),
    };
    return chain;
  };

  try {
    const res = await call(getVehicleAvailability, { params: { id: VALID_ID } });

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.data.vehicleId, VALID_ID);
    assert.deepEqual(res.body.data.bookedRanges, ranges);
    assert.equal(capturedFilter.vehicle, VALID_ID);
    assert.deepEqual(capturedFilter.status, { $in: Booking.activeStatuses });
    assert.ok(capturedFilter.endAt.$gte instanceof Date, 'should only return future bookings');
  } finally {
    restore();
  }
});

test('getVehicleAvailability rejects an invalid id', async () => {
  try {
    const res = await call(getVehicleAvailability, { params: { id: 'nope' } });
    assert.equal(res.statusCode, 400);
    assert.equal(res.body.success, false);
  } finally {
    restore();
  }
});
