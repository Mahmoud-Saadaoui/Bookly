import { describe, expect, it } from 'vitest';
import { getApiErrorMessage } from './apiError';

/**
 * These tests lock a product requirement: backend error messages must reach
 * the user VERBATIM. "Vehicle is already booked for these dates" and
 * "Vehicle is rented and cannot be booked" are two different problems and the
 * customer must see exactly which one they are facing.
 */
describe('getApiErrorMessage', () => {
  it('surfaces a backend message verbatim', () => {
    const error = {
      response: { data: { success: false, message: 'Vehicle is already booked for these dates' } },
    };

    expect(getApiErrorMessage(error)).toBe('Vehicle is already booked for these dates');
  });

  it('prefers the specific field messages over the generic message', () => {
    const error = {
      response: {
        data: {
          success: false,
          message: 'Validation failed',
          errors: [{ field: 'email', message: 'Invalid email' }],
        },
      },
    };

    expect(getApiErrorMessage(error)).toBe('Invalid email');
  });

  it('drops duplicated messages and joins the rest with a bullet', () => {
    // express-validator emits one entry per failed check, and `trim` +
    // `isEmail` + `normalizeEmail` all fail on the same input.
    const error = {
      response: {
        data: {
          message: 'Validation failed',
          errors: [
            { field: 'email', message: 'Invalid email' },
            { field: 'confirmEmail', message: 'Invalid email' },
            { field: 'password', message: 'Too short' },
          ],
        },
      },
    };

    expect(getApiErrorMessage(error)).toBe('Invalid email • Too short');
  });

  it('accepts plain string entries as well as objects', () => {
    const error = { response: { data: { message: 'Validation failed', errors: ['Invalid email'] } } };

    expect(getApiErrorMessage(error)).toBe('Invalid email');
  });

  it('ignores blank field messages', () => {
    const error = {
      response: {
        data: {
          message: 'Validation failed',
          errors: [
            { field: 'email', message: '   ' },
            { field: 'name', message: 'Required' },
          ],
        },
      },
    };

    expect(getApiErrorMessage(error)).toBe('Required');
  });

  it('falls back to `message` when the errors field is not an array', () => {
    const error = { response: { data: { message: 'Validation failed', errors: { field: 'email' } } } };

    expect(getApiErrorMessage(error)).toBe('Validation failed');
  });

  it('returns the fallback when the backend sent nothing usable', () => {
    expect(getApiErrorMessage({ response: { data: { message: '   ' } } }, 'Network down')).toBe(
      'Network down',
    );
    expect(getApiErrorMessage({ response: { data: {} } })).toBe('An error occurred');
  });

  it('returns the fallback for a request that never reached the backend', () => {
    expect(getApiErrorMessage({ code: 'ERR_NETWORK' }, 'No connection')).toBe('No connection');
    expect(getApiErrorMessage(undefined)).toBe('An error occurred');
  });
});
