/**
 * Strips keys that start with "$" or contain "." from user-supplied input
 * (body, query, params) recursively.
 *
 * This protects against NoSQL operator injection (e.g. `?status[$ne]=null`
 * or `{ email: { $ne: null } }`) while still allowing the application code to
 * build trusted query filters with operators ($in, $ne, $lt, ...).
 *
 * It replaces mongoose's global `sanitizeFilter` option, which sanitizes every
 * filter value (including server-built ones) and therefore breaks legitimate
 * operator queries.
 */

const FORBIDDEN_KEY = /(^|\$)|\./;

const sanitizeValue = (value) => {
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value && typeof value === 'object') {
    const clean = {};
    for (const key of Object.keys(value)) {
      if (key.startsWith('$') || key.includes('.')) continue;
      clean[key] = sanitizeValue(value[key]);
    }
    return clean;
  }

  return value;
};

const sanitizeRequest = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeValue(req.body);
  }

  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeValue(req.params);
  }

  if (req.query && typeof req.query === 'object') {
    // Express exposes `req.query` as a prototype getter that re-parses on every
    // access, so we shadow it with an own data property holding the clean value.
    Object.defineProperty(req, 'query', {
      value: sanitizeValue(req.query),
      writable: true,
      enumerable: true,
      configurable: true
    });
  }

  next();
};

module.exports = { sanitizeRequest, sanitizeValue, FORBIDDEN_KEY };
