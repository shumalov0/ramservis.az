'use client';

import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './use-local-storage';

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useLocalStorage<string[]>('ramservis_favorites', []);

  const isFavorite = useCallback((id: string) => favoriteIds.includes(id), [favoriteIds]);

  const toggleFavorite = useCallback((id: string) => {
    setFavoriteIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  }, [setFavoriteIds]);

  const count = favoriteIds.length;

  return useMemo(() => ({ favoriteIds, isFavorite, toggleFavorite, count }), [favoriteIds, isFavorite, toggleFavorite, count]);
}


