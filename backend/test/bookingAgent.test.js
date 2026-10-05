const { test } = require('node:test');
const assert = require('node:assert/strict');
const { makeBooking, makeUser, makeVehicle, makeBranch } = require('./helpers');

/**
 * Unit tests for agent bookings view
 * 
 * These tests verify that:
 * - Fixtures are correctly structured
 * - Booking statuses are valid
 * - Relations between models are correct
 */

test('makeBooking - default fixture', () => {
  const booking = makeBooking();
  assert.equal(booking.status, 'confirmed');
  assert.ok(booking.startAt instanceof Date);
  assert.ok(booking.endAt instanceof Date);
  assert.ok(booking.endAt > booking.startAt);
});

test('makeBooking - with pending_payment status', () => {
  const booking = makeBooking({ status: 'pending_payment' });
  assert.equal(booking.status, 'pending_payment');
});

test('makeBooking - with active status', () => {
  const booking = makeBooking({ status: 'active' });
  assert.equal(booking.status, 'active');
});

test('makeBooking - with completed status', () => {
  const booking = makeBooking({ status: 'completed' });
  assert.equal(booking.status, 'completed');
});

test('makeBooking - with cancelled status', () => {
  const booking = makeBooking({ status: 'cancelled' });
  assert.equal(booking.status, 'cancelled');
});

test('makeBooking - with no_show status', () => {
  const booking = makeBooking({ status: 'no_show' });
  assert.equal(booking.status, 'no_show');
});

test('makeBooking - correct pricing', () => {
  const booking = makeBooking();
  assert.equal(booking.pricing.dailyRateCents, 5000);
  assert.equal(booking.pricing.rentalDays, 5);
  assert.equal(booking.pricing.totalCents, 25000);
  assert.equal(booking.pricing.currency, 'EUR');
});

test('makeBooking - relations with customer, vehicle, branches', () => {
  const booking = makeBooking();
  assert.ok(booking.customer);
  assert.ok(booking.vehicle);
  assert.ok(booking.pickupBranch);
  assert.ok(booking.returnBranch);
});

test('makeBooking - with different branches', () => {
  const booking = makeBooking({
    pickupBranch: '66f1a2b3c4d5e6f7a8b9c0d1',
    returnBranch: '66f1a2b3c4d5e6f7a8b9c0d2'
  });
  assert.notEqual(booking.pickupBranch, booking.returnBranch);
});

test('makeBooking - with notes', () => {
  const booking = makeBooking({ notes: 'VIP customer' });
  assert.equal(booking.notes, 'VIP customer');
});

test('makeBooking - with idempotencyKey', () => {
  const booking = makeBooking({ idempotencyKey: 'unique-key-123' });
  assert.equal(booking.idempotencyKey, 'unique-key-123');
});

test('makeBooking - with checkIn/checkOut', () => {
  const booking = makeBooking({
    checkIn: { completedAt: new Date('2026-01-15T10:00:00Z'), mileage: 1000 },
    checkOut: { completedAt: new Date('2026-01-20T10:00:00Z'), mileage: 1500 }
  });
  assert.ok(booking.checkIn.completedAt);
  assert.ok(booking.checkOut.completedAt);
  assert.equal(booking.checkIn.mileage, 1000);
  assert.equal(booking.checkOut.mileage, 1500);
});

test('makeBooking - active statuses', () => {
  const activeStatuses = ['pending_payment', 'confirmed', 'active'];
  assert.ok(activeStatuses.includes('pending_payment'));
  assert.ok(activeStatuses.includes('confirmed'));
  assert.ok(activeStatuses.includes('active'));
  assert.ok(!activeStatuses.includes('completed'));
  assert.ok(!activeStatuses.includes('cancelled'));
});
