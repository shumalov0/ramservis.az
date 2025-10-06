'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to handle hydration mismatch issues
 * Returns true only after client-side hydration is complete
 */
export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}

/**
 * Hook for safe date formatting that prevents hydration mismatches
 */
export function useSafeDate() {
  const isHydrated = useHydration();

  const formatDate = (dateString: string, locale: string = 'az') => {
    if (!isHydrated) {
      // Return a consistent format during SSR
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }

    // Client-side formatting
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    if (locale === 'az') {
      const months = [
        'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
        'iyul', 'avqust', 'sentyabr', 'oktyabr', 'noyabr', 'dekabr'
      ];
      return `${day} ${months[date.getMonth()]} ${year}`;
    }
    
    return `${day}/${month}/${year}`;
  };

  return { formatDate, isHydrated };
}