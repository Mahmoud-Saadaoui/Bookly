/**
 * Booking draft persistence.
 *
 * A visitor may start a booking before being logged in. When we send them to
 * the login page we keep their in-progress selection in localStorage so the
 * form is restored once they come back, instead of starting over.
 *
 * We only ever store ONE small draft. Every access is wrapped in try/catch so a
 * disabled, full or unavailable localStorage can never break the booking page.
 */

const STORAGE_KEY = 'fleetly_booking_draft';

// Old drafts are ignored and removed on read so stale data never piles up.
const MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

const toIsoString = (value) => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

export const clearBookingDraft = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Could not clear the booking draft:', error);
  }
};

export const saveBookingDraft = (draft) => {
  if (!draft?.vehicleId) return;

  try {
    const payload = {
      vehicleId: draft.vehicleId,
      startDate: toIsoString(draft.startDate),
      endDate: toIsoString(draft.endDate),
      pickupTime: draft.pickupTime || '10:00',
      returnTime: draft.returnTime || '10:00',
      pickupBranch: draft.pickupBranch || '',
      returnBranch: draft.returnBranch || '',
      notes: draft.notes || '',
      savedAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (error) {
    // Persisting the draft is a nice-to-have: never block the booking flow.
    console.warn('Could not save the booking draft:', error);
  }
};

/**
 * Read the draft for a given vehicle. Returns `null` when there is nothing to
 * restore (no draft, another vehicle, expired, or corrupted data).
 */
export const loadBookingDraft = (vehicleId) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const draft = JSON.parse(raw);
    const isExpired = !draft.savedAt || Date.now() - draft.savedAt > MAX_AGE_MS;
    const isAnotherVehicle = vehicleId && draft.vehicleId !== vehicleId;

    if (isExpired || isAnotherVehicle) {
      clearBookingDraft();
      return null;
    }

    return {
      startDate: draft.startDate ? new Date(draft.startDate) : null,
      endDate: draft.endDate ? new Date(draft.endDate) : null,
      pickupTime: draft.pickupTime || '10:00',
      returnTime: draft.returnTime || '10:00',
      pickupBranch: draft.pickupBranch || '',
      returnBranch: draft.returnBranch || '',
      notes: draft.notes || '',
    };
  } catch (error) {
    console.warn('Could not read the booking draft:', error);
    clearBookingDraft();
    return null;
  }
};
