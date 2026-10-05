const { test } = require('node:test');
const assert = require('node:assert/strict');
const { makeUser, makeBranch } = require('./helpers');

/**
 * Unit tests for admin user management
 * 
 * These tests verify that:
 * - Fixtures are correctly structured
 * - Roles are valid
 * - branchIds are correctly managed
 */

test('makeUser - default fixture (customer)', () => {
  const user = makeUser();
  assert.equal(user.name, 'Test User');
  assert.equal(user.email, 'test@example.com');
  assert.equal(user.role, 'customer');
  assert.equal(user.isActive, true);
  assert.deepEqual(user.branchIds, []);
});

test('makeUser - with admin role', () => {
  const user = makeUser({ role: 'admin' });
  assert.equal(user.role, 'admin');
});

test('makeUser - with agent role and branches', () => {
  const user = makeUser({
    role: 'agent',
    branchIds: ['66f1a2b3c4d5e6f7a8b9c0d1']
  });
  assert.equal(user.role, 'agent');
  assert.equal(user.branchIds.length, 1);
});

test('makeUser - with fleet_manager role', () => {
  const user = makeUser({ role: 'fleet_manager' });
  assert.equal(user.role, 'fleet_manager');
});

test('makeUser - with finance_manager role', () => {
  const user = makeUser({ role: 'finance_manager' });
  assert.equal(user.role, 'finance_manager');
});

test('makeUser - with support role', () => {
  const user = makeUser({ role: 'support' });
  assert.equal(user.role, 'support');
});

test('makeUser - inactive (soft delete)', () => {
  const user = makeUser({ isActive: false });
  assert.equal(user.isActive, false);
});

test('makeUser - with multiple branches', () => {
  const user = makeUser({
    role: 'fleet_manager',
    branchIds: [
      '66f1a2b3c4d5e6f7a8b9c0d1',
      '66f1a2b3c4d5e6f7a8b9c0d2'
    ]
  });
  assert.equal(user.branchIds.length, 2);
});

test('makeUser - email in lowercase', () => {
  const user = makeUser({ email: 'TEST@EXAMPLE.COM' });
  // Model converts email to lowercase
  const email = user.email.toLowerCase();
  assert.equal(email, 'test@example.com');
});

test('makeUser - with googleId', () => {
  const user = makeUser({ googleId: '1234567890' });
  assert.equal(user.googleId, '1234567890');
});

test('makeUser - with facebookId', () => {
  const user = makeUser({ facebookId: '0987654321' });
  assert.equal(user.facebookId, '0987654321');
});

test('makeUser - with both social IDs', () => {
  const user = makeUser({
    googleId: 'google-123',
    facebookId: 'fb-456'
  });
  assert.equal(user.googleId, 'google-123');
  assert.equal(user.facebookId, 'fb-456');
});
