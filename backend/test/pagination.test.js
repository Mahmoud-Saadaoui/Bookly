const { test } = require('node:test');
const assert = require('node:assert/strict');
const { parsePagination, getPaginationMeta } = require('../utils/pagination');

/**
 * Unit tests for pagination utility
 * 
 * These tests verify that:
 * - Parameters are correctly extracted and validated
 * - Bounds are respected (page >= 1, 1 <= limit <= 100)
 * - Metadata is correctly calculated
 */

test('parsePagination - default values when query is empty', () => {
  const result = parsePagination({});
  assert.equal(result.page, 1);
  assert.equal(result.limit, 20);
  assert.equal(result.skip, 0);
});

test('parsePagination - valid page and limit', () => {
  const result = parsePagination({ page: '3', limit: '15' });
  assert.equal(result.page, 3);
  assert.equal(result.limit, 15);
  assert.equal(result.skip, 30); // (3-1) * 15
});

test('parsePagination - negative page reset to 1', () => {
  const result = parsePagination({ page: '-5' });
  assert.equal(result.page, 1);
  assert.equal(result.skip, 0);
});

test('parsePagination - page at 0 reset to 1', () => {
  const result = parsePagination({ page: '0' });
  assert.equal(result.page, 1);
});

test('parsePagination - limit above 100 reset to 100', () => {
  const result = parsePagination({ limit: '999' });
  assert.equal(result.limit, 100);
});

test('parsePagination - limit at 0 reset to default (20)', () => {
  const result = parsePagination({ limit: '0' });
  assert.equal(result.limit, 20);
});

test('parsePagination - non-numeric values fall back to defaults', () => {
  const result = parsePagination({ page: 'abc', limit: 'xyz' });
  assert.equal(result.page, 1);
  assert.equal(result.limit, 20);
});

test('parsePagination - negative limit reset to default', () => {
  const result = parsePagination({ limit: '-10' });
  assert.equal(result.limit, 20);
});

test('getPaginationMeta - correct page count calculation', () => {
  const meta = getPaginationMeta(2, 10, 42);
  assert.equal(meta.page, 2);
  assert.equal(meta.limit, 10);
  assert.equal(meta.total, 42);
  assert.equal(meta.pages, 5); // ceil(42/10) = 5
});

test('getPaginationMeta - total at 0 gives 0 pages', () => {
  const meta = getPaginationMeta(1, 10, 0);
  assert.equal(meta.pages, 0);
});

test('getPaginationMeta - total exactly divisible', () => {
  const meta = getPaginationMeta(1, 10, 50);
  assert.equal(meta.pages, 5);
});
