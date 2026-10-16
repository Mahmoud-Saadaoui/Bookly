import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { clearBookingDraft, loadBookingDraft, saveBookingDraft } from './bookingDraft';

const STORAGE_KEY = 'fleetly_booking_draft';
const DAY_MS = 24 * 60 * 60 * 1000;

/** Minimal localStorage stand-in: node has no DOM, and tests must not depend
 *  on one being available (the module is written to survive that case). */
const createStorage = () => {
  const store = new Map();
  return {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear(),
    key: (index) => [...store.keys()][index] ?? null,
    get length() {
      return store.size;
    },
  };
};

/** Rewrites `savedAt` in the stored draft without going through the module. */
const setSavedAt = (savedAt) => {
  const raw = JSON.parse(globalThis.localStorage.getItem(STORAGE_KEY));
  globalThis.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...raw, savedAt }));
};

const SELECTION = {
  vehicleId: 'veh_1',
  startDate: new Date(2026, 9, 26, 9, 30),
  endDate: new Date(2026, 9, 28, 18, 0),
  pickupTime: '09:30',
  returnTime: '18:00',
  pickupBranch: 'br_1',
  returnBranch: 'br_2',
  notes: 'Baby seat',
};

beforeEach(() => {
  globalThis.localStorage = createStorage();
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('saveBookingDraft', () => {
  it('persists the selection so it survives the login round-trip', () => {
    saveBookingDraft(SELECTION);

    const draft = loadBookingDraft('veh_1');

    expect(draft.startDate.toISOString()).toBe(SELECTION.startDate.toISOString());
    expect(draft.endDate.toISOString()).toBe(SELECTION.endDate.toISOString());
    expect(draft.pickupTime).toBe('09:30');
    expect(draft.returnTime).toBe('18:00');
    expect(draft.pickupBranch).toBe('br_1');
    expect(draft.returnBranch).toBe('br_2');
    expect(draft.notes).toBe('Baby seat');
  });

  it('normalises dates to ISO strings', () => {
    saveBookingDraft({
      vehicleId: 'veh_1',
      startDate: '2026-10-26T09:30:00',
      endDate: '2026-10-28T18:00:00',
    });

    const stored = JSON.parse(globalThis.localStorage.getItem(STORAGE_KEY));

    expect(stored.startDate).toBe(new Date('2026-10-26T09:30:00').toISOString());
    expect(stored.endDate).toBe(new Date('2026-10-28T18:00:00').toISOString());
  });

  it('falls back to 10:00 for missing times', () => {
    saveBookingDraft({ vehicleId: 'veh_1' });

    const draft = loadBookingDraft('veh_1');

    expect(draft.pickupTime).toBe('10:00');
    expect(draft.returnTime).toBe('10:00');
    expect(draft.pickupBranch).toBe('');
    expect(draft.notes).toBe('');
  });

  it('stores an unusable date as null rather than "Invalid Date"', () => {
    saveBookingDraft({ vehicleId: 'veh_1', startDate: 'not-a-date' });

    expect(JSON.parse(globalThis.localStorage.getItem(STORAGE_KEY)).startDate).toBeNull();
  });

  it('writes nothing when the vehicle is missing', () => {
    saveBookingDraft({ startDate: SELECTION.startDate, endDate: SELECTION.endDate });

    expect(globalThis.localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('never throws when localStorage is full or blocked', () => {
    globalThis.localStorage = {
      getItem: () => null,
      setItem: () => {
        throw new Error('QuotaExceededError');
      },
      removeItem: () => {},
    };

    expect(() => saveBookingDraft(SELECTION)).not.toThrow();
    expect(console.warn).toHaveBeenCalled();
  });
});

describe('loadBookingDraft', () => {
  it('returns null when nothing was ever saved', () => {
    expect(loadBookingDraft('veh_1')).toBeNull();
  });

  it('returns null for another vehicle and clears the stale draft', () => {
    // Opening vehicle B must not restore a selection made on vehicle A.
    saveBookingDraft(SELECTION);

    expect(loadBookingDraft('veh_2')).toBeNull();
    expect(globalThis.localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('clears a draft older than 24 hours', () => {
    saveBookingDraft(SELECTION);
    setSavedAt(Date.now() - DAY_MS - 1000);

    expect(loadBookingDraft('veh_1')).toBeNull();
    expect(globalThis.localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('keeps a draft just under 24 hours old', () => {
    saveBookingDraft(SELECTION);
    setSavedAt(Date.now() - DAY_MS + 60_000);

    expect(loadBookingDraft('veh_1')).not.toBeNull();
    expect(globalThis.localStorage.getItem(STORAGE_KEY)).not.toBeNull();
  });

  it('treats a draft without a timestamp as expired', () => {
    saveBookingDraft(SELECTION);
    const raw = JSON.parse(globalThis.localStorage.getItem(STORAGE_KEY));
    delete raw.savedAt;
    globalThis.localStorage.setItem(STORAGE_KEY, JSON.stringify(raw));

    expect(loadBookingDraft('veh_1')).toBeNull();
  });

  it('survives corrupted JSON and clears it', () => {
    globalThis.localStorage.setItem(STORAGE_KEY, '{"vehicleId":');

    expect(loadBookingDraft('veh_1')).toBeNull();
    expect(globalThis.localStorage.getItem(STORAGE_KEY)).toBeNull();
    expect(console.warn).toHaveBeenCalled();
  });

  it('defaults the fields of a minimal payload', () => {
    globalThis.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ vehicleId: 'veh_1', savedAt: Date.now() }),
    );

    const draft = loadBookingDraft('veh_1');

    expect(draft.startDate).toBeNull();
    expect(draft.endDate).toBeNull();
    expect(draft.pickupTime).toBe('10:00');
    expect(draft.notes).toBe('');
  });

  it('returns null instead of throwing when localStorage is unavailable', () => {
    globalThis.localStorage = {
      getItem: () => {
        throw new Error('SecurityError');
      },
      setItem: () => {},
      removeItem: () => {},
    };

    expect(loadBookingDraft('veh_1')).toBeNull();
  });
});

describe('clearBookingDraft', () => {
  it('removes the stored draft', () => {
    saveBookingDraft(SELECTION);

    clearBookingDraft();

    expect(globalThis.localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('never throws when the removal is denied', () => {
    saveBookingDraft(SELECTION);
    globalThis.localStorage.removeItem = () => {
      throw new Error('SecurityError');
    };

    expect(() => clearBookingDraft()).not.toThrow();
  });
});
