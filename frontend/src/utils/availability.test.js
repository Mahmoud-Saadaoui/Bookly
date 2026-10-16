import { describe, expect, it } from 'vitest';
import { format } from 'date-fns';
import { isDayBooked, rangeTouchesBooking, toBookedDayRanges } from './availability';

/**
 * Timezone note: these helpers compare LOCAL day boundaries
 * (`startOfDay` / `endOfDay`), so an absolute timestamp such as
 * `2026-10-19T21:00:00.000Z` lands on different calendar days depending on the
 * machine (this repo runs on Africa/Tunis, CI runs on UTC). Every date here is
 * therefore built with the local Date constructor and assertions are made on
 * `format(date, 'yyyy-MM-dd')`, which keeps the suite green in any timezone.
 */
const day = (year, month, date, hours = 12) => new Date(year, month - 1, date, hours);
const ymd = (date) => format(date, 'yyyy-MM-dd');

// Shape returned by GET /api/vehicles/:id/availability
const BOOKING_19_TO_25 = [
  { startAt: day(2026, 10, 19, 10).toISOString(), endAt: day(2026, 10, 25, 11).toISOString() },
];

describe('toBookedDayRanges', () => {
  it('expands an API range to whole local days', () => {
    const [range] = toBookedDayRanges(BOOKING_19_TO_25);

    expect(ymd(range.start)).toBe('2026-10-19');
    expect(ymd(range.end)).toBe('2026-10-25');
    expect(range.start.getHours()).toBe(0); // startOfDay
    expect(range.end.getHours()).toBe(23); // endOfDay
    expect(range.end.getMilliseconds()).toBe(999);
  });

  it('accepts Date objects as well as ISO strings', () => {
    const [range] = toBookedDayRanges([
      { startAt: day(2026, 10, 19, 10), endAt: day(2026, 10, 25, 11) },
    ]);

    expect(ymd(range.start)).toBe('2026-10-19');
    expect(ymd(range.end)).toBe('2026-10-25');
  });

  it('returns an empty list when the vehicle has no booking', () => {
    expect(toBookedDayRanges()).toEqual([]);
    expect(toBookedDayRanges([])).toEqual([]);
  });
});

describe('isDayBooked', () => {
  it('blocks every day of a booking, endpoints included', () => {
    const bookedDays = toBookedDayRanges(BOOKING_19_TO_25);

    for (let date = 19; date <= 25; date += 1) {
      expect(isDayBooked(day(2026, 10, date), bookedDays)).toBe(true);
    }
  });

  it('keeps the days just before and just after available', () => {
    const bookedDays = toBookedDayRanges(BOOKING_19_TO_25);

    expect(isDayBooked(day(2026, 10, 18), bookedDays)).toBe(false);
    expect(isDayBooked(day(2026, 10, 26), bookedDays)).toBe(false);
  });

  it('treats a partially booked day as fully booked', () => {
    // Picking up at 18:00 on the 19th: the customer must not be offered that
    // day even though it is only taken in the evening.
    const bookedDays = toBookedDayRanges([
      { startAt: day(2026, 10, 19, 18), endAt: day(2026, 10, 21, 9) },
    ]);

    expect(isDayBooked(day(2026, 10, 19), bookedDays)).toBe(true);
    expect(isDayBooked(day(2026, 10, 21), bookedDays)).toBe(true);
    expect(isDayBooked(day(2026, 10, 22), bookedDays)).toBe(false);
  });

  it('accounts for every booking on the same vehicle', () => {
    const bookedDays = toBookedDayRanges([
      { startAt: day(2026, 10, 5, 9), endAt: day(2026, 10, 7, 18) },
      { startAt: day(2026, 10, 19, 10), endAt: day(2026, 10, 25, 11) },
    ]);

    expect(isDayBooked(day(2026, 10, 6), bookedDays)).toBe(true);
    expect(isDayBooked(day(2026, 10, 12), bookedDays)).toBe(false);
    expect(isDayBooked(day(2026, 10, 22), bookedDays)).toBe(true);
  });

  it('blocks nothing when the vehicle has no booking', () => {
    expect(isDayBooked(day(2026, 10, 19), [])).toBe(false);
    expect(isDayBooked(day(2026, 10, 19))).toBe(false);
  });
});

describe('rangeTouchesBooking', () => {
  const bookedDays = toBookedDayRanges(BOOKING_19_TO_25); // 19 -> 25

  it('returns false while one endpoint is missing', () => {
    expect(rangeTouchesBooking(null, day(2026, 10, 20), bookedDays)).toBe(false);
    expect(rangeTouchesBooking(day(2026, 10, 20), undefined, bookedDays)).toBe(false);
  });

  it('accepts a range starting before the booking and ending inside it', () => {
    expect(rangeTouchesBooking(day(2026, 10, 18), day(2026, 10, 19), bookedDays)).toBe(true);
  });

  it('accepts a range starting inside the booking and ending after it', () => {
    expect(rangeTouchesBooking(day(2026, 10, 25), day(2026, 10, 27), bookedDays)).toBe(true);
  });

  it('accepts a range spanning the whole booking', () => {
    expect(rangeTouchesBooking(day(2026, 10, 1), day(2026, 11, 1), bookedDays)).toBe(true);
  });

  it('rejects a range lying entirely before the booking', () => {
    expect(rangeTouchesBooking(day(2026, 10, 16), day(2026, 10, 18), bookedDays)).toBe(false);
  });

  it('rejects a range lying entirely after the booking (regression)', () => {
    // Reported bug: "Vehicle is not available for these dates" while the
    // requested dates were free, because the neighbouring booking on the
    // 19th-25th was mistaken for an overlap with the 26th-28th.
    expect(rangeTouchesBooking(day(2026, 10, 26), day(2026, 10, 28), bookedDays)).toBe(false);
  });

  it('rejects a range placed between two bookings', () => {
    const twoBookings = toBookedDayRanges([
      { startAt: day(2026, 10, 5, 9), endAt: day(2026, 10, 7, 18) },
      { startAt: day(2026, 10, 19, 10), endAt: day(2026, 10, 25, 11) },
    ]);

    expect(rangeTouchesBooking(day(2026, 10, 12), day(2026, 10, 14), twoBookings)).toBe(false);
    expect(rangeTouchesBooking(day(2026, 10, 7), day(2026, 10, 20), twoBookings)).toBe(true);
  });
});
