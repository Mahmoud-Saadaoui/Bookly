import { startOfDay, endOfDay } from 'date-fns';

/**
 * Helpers shared by the availability calendar and the booking page.
 *
 * The API returns booked ranges as `[{ startAt, endAt }]` (ISO strings). On the
 * calendar we reason in whole days: a day counts as booked as soon as one
 * booking overlaps it, so a customer can never pick a partially booked day.
 */

export const toBookedDayRanges = (bookedRanges = []) =>
  bookedRanges.map((range) => ({
    start: startOfDay(new Date(range.startAt)),
    end: endOfDay(new Date(range.endAt)),
  }));

export const isDayBooked = (day, bookedDays = []) => {
  const dayStart = startOfDay(day);
  const dayEnd = endOfDay(day);
  return bookedDays.some((range) => dayStart < range.end && dayEnd > range.start);
};

export const rangeTouchesBooking = (start, end, bookedDays = []) => {
  if (!start || !end) return false;
  const rangeStart = startOfDay(start);
  const rangeEnd = endOfDay(end);
  return bookedDays.some((booking) => rangeStart < booking.end && rangeEnd > booking.start);
};
