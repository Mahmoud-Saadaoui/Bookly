const { test } = require('node:test');
const assert = require('node:assert/strict');

const router = require('../routes/branchRoute');
const auth = require('../middlewares/auth');

/**
 * Regression tests for the public branch endpoints.
 *
 * The vehicle catalogue and the vehicle detail page fetch the branch list for
 * anonymous visitors (agency filter / pickup-return selection). If GET
 * /branches is guarded by auth, anonymous users get a 401 and are bounced to
 * /login, making the catalogue look private. Only writes may require auth.
 */

const findHandlers = (method, path) => {
  const layer = router.stack.find(
    (entry) => entry.route && entry.route.path === path && entry.route.methods[method]
  );
  assert.ok(layer, `route ${method.toUpperCase()} ${path} should exist`);
  return layer.route.stack.map((step) => step.handle);
};

test('GET /branches is public (no auth middleware)', () => {
  const handlers = findHandlers('get', '/');
  assert.ok(
    !handlers.includes(auth.check),
    'GET /branches must not require authentication'
  );
});

test('GET /branches/:id is public (no auth middleware)', () => {
  const handlers = findHandlers('get', '/:id');
  assert.ok(
    !handlers.includes(auth.check),
    'GET /branches/:id must not require authentication'
  );
});

test('branch write routes still require authentication', () => {
  const cases = [
    ['post', '/'],
    ['patch', '/:id'],
    ['delete', '/:id'],
  ];

  cases.forEach(([method, path]) => {
    const handlers = findHandlers(method, path);
    assert.ok(
      handlers.includes(auth.check),
      `${method.toUpperCase()} ${path} must require authentication`
    );
  });
});
