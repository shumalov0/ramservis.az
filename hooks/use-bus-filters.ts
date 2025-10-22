import { useState, useMemo } from 'react';
import { BusFilters, BusSortOption } from '@/lib/types';

interface UseBusFiltersReturn {
  filters: BusFilters;
  search: string;
  priceRange: [number, number];
  year: number | null;
  busType: string | null;
  sort: BusSortOption;
  setFilters: (filters: BusFilters) => void;
  setSearch: (search: string) => void;
  setPriceRange: (range: [number, number]) => void;
  setYear: (year: number | null) => void;
  setBusType: (type: string | null) => void;
  setSort: (sort: BusSortOption) => void;
  resetFilters: () => void;
  activeFiltersCount: number;
}

export function useBusFilters(defaultPriceRange: [number, number]): UseBusFiltersReturn {
  const [filters, setFilters] = useState<BusFilters>({});
  const [search, setSearch] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>(defaultPriceRange);
  const [year, setYear] = useState<number | null>(null);
  const [busType, setBusType] = useState<string | null>(null);
  const [sort, setSort] = useState<BusSortOption>('popularity');

  const resetFilters = () => {
    setFilters({});
    setSearch('');
    setPriceRange(defaultPriceRange);
    setYear(null);
    setBusType(null);
    setSort('popularity');
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    
    if (search.trim()) count++;
    if (priceRange[0] !== defaultPriceRange[0] || priceRange[1] !== defaultPriceRange[1]) count++;
    if (year) count++;
    if (busType) count++;
    if (filters.category?.length) count++;
    if (filters.fuelType?.length) count++;
    if (filters.transmission?.length) count++;
    if (filters.features?.length) count++;
    if (filters.capacity) count++;
    
    return count;
  }, [filters, search, priceRange, year, busType, defaultPriceRange]);

  return {
    filters,
    search,
    priceRange,
    year,
    busType,
    sort,
    setFilters,
    setSearch,
    setPriceRange,
    setYear,
    setBusType,
    setSort,
    resetFilters,
    activeFiltersCount,
  };
}