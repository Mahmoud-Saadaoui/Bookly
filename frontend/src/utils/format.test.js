import { describe, expect, it } from 'vitest';
import { formatCurrency, formatDate, formatDateTime, formatNumber } from './format';

/**
 * Dates are built with the local Date constructor so the assertions stay valid
 * in any timezone (this machine runs on Africa/Tunis, CI on UTC).
 * `day(2026, 10, 19)` is always "19 October" locally.
 */
const day = (year, month, date, hours = 12, minutes = 0) =>
  new Date(year, month - 1, date, hours, minutes);

describe('formatCurrency', () => {
  it('converts cents to euros', () => {
    // fr-FR groups with U+202F and separates the unit with U+00A0; \s matches
    // both, so this stays readable whatever the ICU version ships.
    expect(formatCurrency(168000)).toMatch(/^1\s680,00\s€$/);
  });

  it('handles a zero amount', () => {
    expect(formatCurrency(0)).toMatch(/^0,00\s€$/);
  });

  it('handles a negative amount', () => {
    // -5000 cents = -50,00 €. The minus glyph differs between ICU versions
    // (U+002D vs U+2212), so only the converted amount is asserted.
    expect(formatCurrency(-5000)).toMatch(/50,00\s€$/);
  });

  it('renders a missing amount as zero instead of crashing', () => {
    expect(formatCurrency(null)).toMatch(/^0,00\s€$/);
    expect(formatCurrency(undefined)).toMatch(/^0,00\s€$/);
  });
});

describe('formatDate', () => {
  it('formats a Date', () => {
    expect(formatDate(day(2026, 10, 19))).toBe('19 octobre 2026');
  });

  it('formats an ISO string', () => {
    expect(formatDate('2026-10-19T10:00:00')).toBe('19 octobre 2026');
  });

  it('returns an empty string when there is nothing to format', () => {
    expect(formatDate(null)).toBe('');
    expect(formatDate(undefined)).toBe('');
    expect(formatDate('')).toBe('');
  });

  it('returns an empty string instead of throwing on a broken date', () => {
    // The catch path: `format` raises a RangeError on an Invalid Date, and the
    // booking page must never crash because an API field was malformed.
    expect(formatDate('not-a-date')).toBe('');
    expect(formatDate('2026-13-45')).toBe('');
  });
});

describe('formatDateTime', () => {
  it('includes the time with the abbreviated month', () => {
    expect(formatDateTime(day(2026, 10, 19, 14, 30))).toBe('19 oct. 2026 14:30');
  });

  it('formats an ISO string', () => {
    expect(formatDateTime('2026-10-19T14:30:00')).toBe('19 oct. 2026 14:30');
  });

  it('returns an empty string when there is nothing to format', () => {
    expect(formatDateTime(null)).toBe('');
    expect(formatDateTime('not-a-date')).toBe('');
  });
});

describe('formatNumber', () => {
  it('formats with the French grouping', () => {
    expect(formatNumber(1234.5)).toMatch(/^1\s234,5$/);
  });

  it('renders a missing amount as zero', () => {
    expect(formatNumber(null)).toBe('0');
    expect(formatNumber(undefined)).toBe('0');
  });
});
