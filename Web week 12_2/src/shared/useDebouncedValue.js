import { useState, useEffect } from 'react';

/**
 * Returns `value` only after it has stopped changing for `delay` ms.
 * Pattern from the lecture: setTimeout in the effect + clearTimeout in cleanup,
 * so rapid typing cancels the pending update.
 */
export function useDebouncedValue(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
