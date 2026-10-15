const { test } = require('node:test');
const assert = require('node:assert/strict');

const Vehicle = require('../models/vehicle');
const { getVehicles } = require('../controllers/vehicleController');

/**
 * Unit tests for the free-text search on GET /api/vehicles.
 *
 * The Mongoose model is stubbed so the tests can assert the exact filter
 * handed to the database without needing a running MongoDB.
 */

const originalFind = Vehicle.find;
const originalCountDocuments = Vehicle.countDocuments;

const stubModel = (docs = []) => {
  let capturedFilter = null;

  Vehicle.find = (filter) => {
    capturedFilter = filter;
    const chain = {
      sort: () => chain,
      skip: () => chain,
      limit: () => chain,
      lean: () => Promise.resolve(docs),
    };
    return chain;
  };
  Vehicle.countDocuments = () => Promise.resolve(docs.length);

  return {
    getFilter: () => capturedFilter,
  };
};

const restoreModel = () => {
  Vehicle.find = originalFind;
  Vehicle.countDocuments = originalCountDocuments;
};

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

const callGetVehicles = async (query, docs = []) => {
  const stub = stubModel(docs);
  const res = makeResponse();
  const errors = [];

  getVehicles({ query }, res, (error) => errors.push(error));
  // Let the internal promise chain (asyncHandler) settle.
  await new Promise((resolve) => setImmediate(resolve));

  restoreModel();
  if (errors.length) throw errors[0];
  return { res, filter: stub.getFilter() };
};

test('search builds a case-insensitive $or on make and model', async () => {
  const { filter } = await callGetVehicles({ search: 'model' });

  assert.ok(Array.isArray(filter.$or), '$or should be present');
  assert.equal(filter.$or.length, 2);
  assert.ok(filter.$or[0].make instanceof RegExp);
  assert.ok(filter.$or[1].model instanceof RegExp);
  assert.equal(filter.$or[0].make.flags, 'i');
  assert.ok(filter.$or[1].model.test('Model 3'));
  assert.ok(filter.$or[1].model.test('MODEL Y'), 'must be case-insensitive');
  assert.equal(filter.$or[0].make.test('Porsche'), false);
});

test('search is trimmed and combines with other filters', async () => {
  const { filter } = await callGetVehicles({ search: '  tesla  ', category: 'Électrique' });

  assert.equal(filter.category, 'Électrique');
  assert.equal(filter.isDeleted, false);
  assert.deepEqual(filter.status, { $ne: 'retired' });
  assert.ok(filter.$or[0].make.test('Tesla'));
});

test('search with only whitespace does not add a $or clause', async () => {
  const { filter } = await callGetVehicles({ search: '   ' });
  assert.equal(filter.$or, undefined);
});

test('no search parameter leaves $or undefined', async () => {
  const { filter } = await callGetVehicles({});
  assert.equal(filter.$or, undefined);
});

test('search terms are escaped so regex metacharacters stay literal', async () => {
  const { filter } = await callGetVehicles({ search: 'a.b*' });
  const regex = filter.$or[0].make;

  assert.ok(regex.test('a.b*'), 'the literal term should match itself');
  assert.equal(regex.test('axb'), false, 'the dot must not act as a wildcard');
});

test('search term is capped at 60 characters', async () => {
  const { filter } = await callGetVehicles({ search: 'x'.repeat(200) });
  assert.ok(filter.$or[0].make.source.length <= 60);
});

test('search returns the paginated payload', async () => {
  const docs = [{ _id: '1', make: 'Tesla', model: 'Model 3' }];
  const { res } = await callGetVehicles({ search: 'tesla' }, docs);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.data.length, 1);
  assert.ok(res.body.pagination);
});
