import { useEffect, useState } from 'react';

/**
 * Returns a debounced copy of `value` that only updates once `delay`
 * milliseconds have elapsed without further changes.
 *
 * Initialised with `value` so the first render is never delayed.
 */
export const useDebouncedValue = (value, delay = 350) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};

export default useDebouncedValue;
