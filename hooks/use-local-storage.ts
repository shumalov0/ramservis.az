'use client';

import { useEffect, useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const item = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
      if (item !== null) {
        setStoredValue(JSON.parse(item) as T);
      }
    } catch {
      // ignore parse errors
    } finally {
      setIsHydrated(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch {
      // ignore write errors
    }
  }, [key, storedValue, isHydrated]);

  return [storedValue, setStoredValue] as const;
}


