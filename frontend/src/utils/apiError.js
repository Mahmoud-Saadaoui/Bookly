/**
 * API error helpers.
 *
 * The backend always answers errors as `{ success: false, message, errors? }`:
 * - controllers send only `message` (e.g. "User already exists");
 * - the `validate` middleware sends a generic "Validation failed" in `message`
 *   and the real reasons in `errors: [{ field, message }]`.
 *
 * Reading `message` alone therefore hides what actually failed, so prefer the
 * per-field messages whenever they are present.
 */

const toMessages = (errors) => {
  if (!Array.isArray(errors)) return [];
  return errors
    .map((entry) => (typeof entry === 'string' ? entry : entry?.message))
    .filter((message) => typeof message === 'string' && message.trim() !== '');
};

/**
 * Extract the most specific error message from an axios error.
 * @param {Error} error - The caught axios error.
 * @param {string} fallback - Message used when the backend sent nothing usable.
 * @returns {string}
 */
export const getApiErrorMessage = (error, fallback = 'An error occurred') => {
  const data = error?.response?.data;

  // express-validator emits one entry per failed check, and a single rule can
  // fail several checks (e.g. `trim` + `isEmail` + `normalizeEmail`), so
  // duplicates are dropped to keep the toast readable.
  const fieldMessages = [...new Set(toMessages(data?.errors))];

  if (fieldMessages.length > 0) return fieldMessages.join(' • ');
  if (typeof data?.message === 'string' && data.message.trim() !== '') return data.message;

  return fallback;
};

export default getApiErrorMessage;
