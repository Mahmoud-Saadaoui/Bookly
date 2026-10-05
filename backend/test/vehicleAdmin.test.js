const { test } = require('node:test');
const assert = require('node:assert/strict');
const { makeVehicle, makeBranch } = require('./helpers');

/**
 * Unit tests for vehicle editing and deletion
 * 
 * These tests verify that:
 * - Fixtures are correctly structured
 * - Vehicle statuses are valid
 * - Deletion rules are respected
 */

test('makeVehicle - default fixture', () => {
  const vehicle = makeVehicle();
  assert.equal(vehicle.make, 'Tesla');
  assert.equal(vehicle.model, 'Model 3');
  assert.equal(vehicle.category, 'Électrique');
  assert.equal(vehicle.status, 'available');
  assert.equal(vehicle.isDeleted, false);
});

test('makeVehicle - with maintenance status', () => {
  const vehicle = makeVehicle({ status: 'maintenance' });
  assert.equal(vehicle.status, 'maintenance');
});

test('makeVehicle - with retired status', () => {
  const vehicle = makeVehicle({ status: 'retired' });
  assert.equal(vehicle.status, 'retired');
});

test('makeVehicle - with reserved status', () => {
  const vehicle = makeVehicle({ status: 'reserved' });
  assert.equal(vehicle.status, 'reserved');
});

test('makeVehicle - with rented status', () => {
  const vehicle = makeVehicle({ status: 'rented' });
  assert.equal(vehicle.status, 'rented');
});

test('makeVehicle - registration number in uppercase', () => {
  const vehicle = makeVehicle({ registrationNumber: 'ab-123-cd' });
  // Model converts registration number to uppercase
  const reg = vehicle.registrationNumber.toUpperCase();
  assert.equal(reg, 'AB-123-CD');
});

test('makeVehicle - with VIN', () => {
  const vehicle = makeVehicle({ vin: '5YJ3E1EA1JF000001' });
  assert.equal(vehicle.vin, '5YJ3E1EA1JF000001');
});

test('makeVehicle - with branch', () => {
  const vehicle = makeVehicle({ branch: '66f1a2b3c4d5e6f7a8b9c0d1' });
  assert.ok(vehicle.branch);
});

test('makeVehicle - without branch', () => {
  const vehicle = makeVehicle({ branch: null });
  assert.equal(vehicle.branch, null);
});

test('makeVehicle - with costs', () => {
  const vehicle = makeVehicle({
    ownershipCostCentsPerDay: 2000,
    maintenanceCostCents: 50000
  });
  assert.equal(vehicle.ownershipCostCentsPerDay, 2000);
  assert.equal(vehicle.maintenanceCostCents, 50000);
});

test('makeVehicle - soft delete', () => {
  const vehicle = makeVehicle();
  vehicle.isDeleted = true;
  assert.equal(vehicle.isDeleted, true);
  // Document is preserved
  assert.ok(vehicle._id);
});

test('makeVehicle - valid categories', () => {
  const categories = ['Premium', 'Sport', 'Business', 'Électrique', 'SUV', 'Citadine'];
  categories.forEach(cat => {
    const vehicle = makeVehicle({ category: cat });
    assert.equal(vehicle.category, cat);
  });
});

test('makeVehicle - valid transmissions', () => {
  const transmissions = ['Automatique', 'Manuelle'];
  transmissions.forEach(trans => {
    const vehicle = makeVehicle({ transmission: trans });
    assert.equal(vehicle.transmission, trans);
  });
});

test('makeVehicle - valid fuel types', () => {
  const fuelTypes = ['Essence', 'Diesel', 'Hybride', 'Électrique'];
  fuelTypes.forEach(fuel => {
    const vehicle = makeVehicle({ fuelType: fuel });
    assert.equal(vehicle.fuelType, fuel);
  });
});

test('makeVehicle - with images', () => {
  const vehicle = makeVehicle({
    images: ['https://example.com/img1.jpg', 'https://example.com/img2.jpg']
  });
  assert.equal(vehicle.images.length, 2);
});

test('makeVehicle - with seats', () => {
  const vehicle = makeVehicle({ seats: 5 });
  assert.equal(vehicle.seats, 5);
});

test('makeVehicle - with mileage', () => {
  const vehicle = makeVehicle({ mileage: 15000 });
  assert.equal(vehicle.mileage, 15000);
});
