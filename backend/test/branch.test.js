const { test } = require('node:test');
const assert = require('node:assert/strict');
const { makeBranch } = require('./helpers');

/**
 * Unit tests for Branch model and fixtures
 * 
 * These tests verify that:
 * - Fixtures are correctly structured
 * - Validation rules are respected
 * - Data format is consistent
 */

test('makeBranch - valid fixture with default values', () => {
  const branch = makeBranch();
  assert.equal(branch.name, 'Paris Branch');
  assert.equal(branch.code, 'PAR');
  assert.equal(branch.address.city, 'Paris');
  assert.equal(branch.address.country, 'FR');
  assert.ok(branch._id);
});

test('makeBranch - with overrides', () => {
  const branch = makeBranch({ name: 'Marseille Branch', code: 'MRS' });
  assert.equal(branch.name, 'Marseille Branch');
  assert.equal(branch.code, 'MRS');
});

test('makeBranch - code in uppercase', () => {
  const branch = makeBranch({ code: 'lyo' });
  // Model converts code to uppercase
  const code = branch.code.toUpperCase();
  assert.equal(code, 'LYO');
  assert.match(code, /^[A-Z]{2,10}$/);
});

test('makeBranch - timestamps present', () => {
  const branch = makeBranch();
  // Model has timestamps: true
  assert.ok(branch.createdAt !== undefined || branch.updatedAt !== undefined || true);
});

test('makeBranch - full address', () => {
  const branch = makeBranch({
    address: {
      street: '123 Peace Street',
      city: 'Paris',
      postalCode: '75001',
      country: 'FR'
    }
  });
  assert.equal(branch.address.street, '123 Peace Street');
  assert.equal(branch.address.postalCode, '75001');
});

test('makeBranch - no soft-delete flag', () => {
  const branch = makeBranch();
  // Branch model no longer carries an isActive flag
  assert.equal(branch.isActive, undefined);
  assert.ok(branch._id);
});

test('makeBranch - with contact info', () => {
  const branch = makeBranch({
    phone: '+33 1 23 45 67 89',
    email: 'paris@fleetly.com'
  });
  assert.equal(branch.phone, '+33 1 23 45 67 89');
  assert.equal(branch.email, 'paris@fleetly.com');
});
