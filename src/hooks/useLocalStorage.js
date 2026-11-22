import { useCallback, useState } from 'react';

/**
 * Generic, reusable localStorage-backed state hook.
 *
 * - Reads once, lazily, on mount.
 * - Treats a missing key (null) as "nothing saved yet" and falls back to
 *   initialValue — but a saved empty array/object is respected as real data,
 *   so clearing all tasks does not cause sample data to reappear on refresh.
 * - Swallows and logs read/write errors (corrupted JSON, storage disabled in
 *   a private tab, quota exceeded) instead of crashing the app.
 */
export function useLocalStorage(key, initialValue) {
  const resolveInitial = () => (initialValue instanceof Function ? initialValue() : initialValue);

  const [storedValue, setStoredValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return resolveInitial();
      return JSON.parse(raw);
    } catch (error) {
      console.error(`useLocalStorage: could not read key "${key}", falling back to default.`, error);
      return resolveInitial();
    }
  });

  const setValue = useCallback((value) => {
    setStoredValue((prev) => {
      const valueToStore = value instanceof Function ? value(prev) : value;
      try {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`useLocalStorage: could not persist key "${key}".`, error);
      }
      return valueToStore;
    });
  }, [key]);

  return [storedValue, setValue];
}
