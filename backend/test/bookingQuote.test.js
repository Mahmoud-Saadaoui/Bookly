const { test } = require('node:test');
const assert = require('node:assert/strict');

const Vehicle = require('../models/vehicle');
const Booking = require('../models/booking');
const { quoteBooking, createBooking } = require('../controllers/bookingController');

/**
 * The API must explain WHY a booking is refused:
 *   - the car itself is rented / reserved / in maintenance -> "cannot be booked"
 *   - only the requested dates are taken                   -> "already booked"
 * Those two causes used to be merged into one misleading message.
 *
 * Mongoose methods are stubbed so no MongoDB is required.
 */

const VALID_ID = '507f1f77bcf86cd799439011';

const originalVehicleFindOne = Vehicle.findOne;
const originalBookingExists = Booking.exists;

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
  Booking.exists = originalBookingExists;
};

const BODY = {
  vehicleId: VALID_ID,
  startAt: '2030-01-10T10:00:00.000Z',
  endAt: '2030-01-12T10:00:00.000Z'
};

const vehicleDoc = (status) => ({ _id: VALID_ID, status, dailyRateCents: 10000, currency: 'EUR' });

// quoteBooking uses `Vehicle.findOne(...).lean()`
const stubQuoteVehicle = (status) => {
  Vehicle.findOne = () => ({ lean: () => Promise.resolve(status ? vehicleDoc(status) : null) });
};

test('quote explains that a rented vehicle cannot be booked', async () => {
  let existsCalled = false;
  stubQuoteVehicle('rented');
  Booking.exists = async () => {
    existsCalled = true;
    return { _id: 'conflict' };
  };

  try {
    const res = await call(quoteBooking, { body: BODY });

    assert.equal(res.statusCode, 409);
    assert.equal(res.body.message, 'Vehicle is rented and cannot be booked');
    assert.equal(existsCalled, false, 'should not look for a conflict when the car itself is unavailable');
  } finally {
    restore();
  }
});

test('quote says the vehicle is in maintenance', async () => {
  stubQuoteVehicle('maintenance');
  Booking.exists = async () => null;

  try {
    const res = await call(quoteBooking, { body: BODY });

    assert.equal(res.statusCode, 409);
    assert.equal(res.body.message, 'Vehicle is in maintenance and cannot be booked');
  } finally {
    restore();
  }
});

test('quote reports a date conflict for an available vehicle', async () => {
  stubQuoteVehicle('available');
  Booking.exists = async () => ({ _id: 'conflict' });

  try {
    const res = await call(quoteBooking, { body: BODY });

    assert.equal(res.statusCode, 409);
    assert.equal(res.body.message, 'Vehicle is already booked for these dates');
  } finally {
    restore();
  }
});

test('quote succeeds and prices 2 days when the vehicle is free', async () => {
  stubQuoteVehicle('available');
  Booking.exists = async () => null;

  try {
    const res = await call(quoteBooking, { body: BODY });

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.pricing.rentalDays, 2);
    assert.equal(res.body.data.pricing.subtotalCents, 20000);
  } finally {
    restore();
  }
});

test('quote returns 404 for a missing vehicle', async () => {
  stubQuoteVehicle(null);
  Booking.exists = async () => null;

  try {
    const res = await call(quoteBooking, { body: BODY });

    assert.equal(res.statusCode, 404);
    assert.equal(res.body.success, false);
  } finally {
    restore();
  }
});

// createBooking awaits `Vehicle.findOne(...)` directly (no .lean()).
const stubCreateVehicle = (status) => {
  Vehicle.findOne = () => (status ? Promise.resolve(vehicleDoc(status)) : Promise.resolve(null));
};

test('create refuses a non-available vehicle with the specific message', async () => {
  stubCreateVehicle('maintenance');
  Booking.exists = async () => null;

  try {
    const res = await call(createBooking, { userId: 'user-1', body: BODY });

    assert.equal(res.statusCode, 409);
    assert.equal(res.body.message, 'Vehicle is in maintenance and cannot be booked');
  } finally {
    restore();
  }
});

test('create reports a date conflict for an available vehicle', async () => {
  stubCreateVehicle('available');
  Booking.exists = async () => ({ _id: 'conflict' });

  try {
    const res = await call(createBooking, { userId: 'user-1', body: BODY });

    assert.equal(res.statusCode, 409);
    assert.equal(res.body.message, 'Vehicle is already booked for these dates');
  } finally {
    restore();
  }
});
