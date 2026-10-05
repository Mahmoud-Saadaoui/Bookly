/**
 * Reusable pagination utility
 * 
 * This module provides two functions:
 * - parsePagination: extracts and validates pagination parameters from query string
 * - getPaginationMeta: builds the metadata object returned to the client
 * 
 * Usage example in a controller:
 *   const { parsePagination, getPaginationMeta } = require('../utils/pagination');
 *   const { page, limit, skip } = parsePagination(req.query);
 *   const [data, total] = await Promise.all([
 *     Model.find(filter).skip(skip).limit(limit).lean(),
 *     Model.countDocuments(filter)
 *   ]);
 *   return paginatedResponse(res, data, getPaginationMeta(page, limit, total));
 */

/**
 * Default pagination parameters and limits
 */
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

/**
 * Extracts and validates pagination parameters from query string
 * 
 * @param {Object} query - Express req.query
 * @returns {Object} { page, limit, skip }
 * 
 * @example
 *   parsePagination({ page: '2', limit: '10' }) -> { page: 2, limit: 10, skip: 10 }
 *   parsePagination({}) -> { page: 1, limit: 20, skip: 0 }
 *   parsePagination({ page: '-5', limit: '999' }) -> { page: 1, limit: 100, skip: 0 }
 */
function parsePagination(query) {
  // Parse page: must be an integer >= 1
  const rawPage = parseInt(query.page, 10);
  const page = Number.isNaN(rawPage) || rawPage < 1 ? DEFAULT_PAGE : rawPage;

  // Parse limit: must be an integer between 1 and MAX_LIMIT
  const rawLimit = parseInt(query.limit, 10);
  let limit = Number.isNaN(rawLimit) ? DEFAULT_LIMIT : rawLimit;
  if (limit < 1) limit = DEFAULT_LIMIT;
  if (limit > MAX_LIMIT) limit = MAX_LIMIT;

  // Calculate skip (number of documents to skip)
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

/**
 * Builds the pagination metadata object returned to the client
 * 
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {number} total - Total number of items
 * @returns {Object} { page, limit, total, pages }
 * 
 * @example
 *   getPaginationMeta(2, 10, 42) -> { page: 2, limit: 10, total: 42, pages: 5 }
 */
function getPaginationMeta(page, limit, total) {
  return {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit) || 0
  };
}

module.exports = {
  parsePagination,
  getPaginationMeta
};
