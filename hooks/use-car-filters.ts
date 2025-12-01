'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CarFilters } from '@/lib/types';
import { SortOption } from '@/components/CarsFilters';

interface UseCarFiltersReturn {
  filters: CarFilters;
  search: string;
  priceRange: [number, number];
  year: number | undefined;
  carClass: string | undefined;
  sort: SortOption;
  setFilters: (filters: CarFilters) => void;
  setSearch: (search: string) => void;
  setPriceRange: (range: [number, number]) => void;
  setYear: (year: number | undefined) => void;
  setCarClass: (carClass: string | undefined) => void;
  setSort: (sort: SortOption) => void;
  resetFilters: () => void;
  activeFiltersCount: number;
  updateURL: () => void;
}

export function useCarFilters(
  defaultPriceRange: [number, number] = [0, 200]
): UseCarFiltersReturn {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize state from URL parameters
  const [filters, setFiltersState] = useState<CarFilters>({});
  
  // Sync filters with URL on mount and when searchParams change
  useEffect(() => {
    const urlFilters: CarFilters = {};
    
    // Parse categories from URL
    const categories = searchParams.get('categories') || searchParams.get('category');
    if (categories) {
      urlFilters.category = categories.split(',');
    }
    
    // Parse fuel types from URL
    const fuelTypes = searchParams.get('fuelTypes');
    if (fuelTypes) {
      urlFilters.fuelType = fuelTypes.split(',');
    }
    
    // Parse transmissions from URL
    const transmissions = searchParams.get('transmissions');
    if (transmissions) {
      urlFilters.transmission = transmissions.split(',');
    }
    
    // Parse features from URL
    const features = searchParams.get('features');
    if (features) {
      urlFilters.features = features.split(',');
    }
    
    // Parse price range from URL
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    if (minPrice && maxPrice) {
      urlFilters.priceRange = [parseInt(minPrice), parseInt(maxPrice)];
    }
    
    // Parse year range from URL
    const minYear = searchParams.get('minYear');
    const maxYear = searchParams.get('maxYear');
    if (minYear && maxYear) {
      urlFilters.year = [parseInt(minYear), parseInt(maxYear)];
    }
    
    setFiltersState(urlFilters);
  }, [searchParams]);
  
  const [search, setSearchState] = useState(() => searchParams.get('search') || '');
  const [priceRange, setPriceRangeState] = useState<[number, number]>(() => {
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    if (minPrice && maxPrice) {
      return [parseInt(minPrice), parseInt(maxPrice)];
    }
    return defaultPriceRange;
  });
  const [year, setYearState] = useState<number | undefined>(() => {
    const yearParam = searchParams.get('year');
    return yearParam ? parseInt(yearParam) : undefined;
  });
  const [carClass, setCarClassState] = useState<string | undefined>(() => 
    searchParams.get('class') || undefined
  );
  const [sort, setSortState] = useState<SortOption>(() => 
    (searchParams.get('sort') as SortOption) || 'price-asc'
  );

  // Calculate active filters count
  const activeFiltersCount = Object.values(filters).filter(value => {
    if (Array.isArray(value)) return value.length > 0;
    return value !== undefined;
  }).length + (search ? 1 : 0) + (year ? 1 : 0) + (carClass ? 1 : 0);

  // Update URL with current filter state
  const updateURL = useCallback(() => {
    const params = new URLSearchParams();
    
    // Add search parameter
    if (search) params.set('search', search);
    
    // Add filter parameters
    if (filters.category?.length) params.set('category', filters.category.join(','));
    if (filters.fuelType?.length) params.set('fuelTypes', filters.fuelType.join(','));
    if (filters.transmission?.length) params.set('transmissions', filters.transmission.join(','));
    if (filters.features?.length) params.set('features', filters.features.join(','));
    
    // Add price range if different from default
    if (priceRange[0] !== defaultPriceRange[0] || priceRange[1] !== defaultPriceRange[1]) {
      params.set('minPrice', priceRange[0].toString());
      params.set('maxPrice', priceRange[1].toString());
    }
    
    // Add year filter
    if (year) params.set('year', year.toString());
    
    // Add class filter
    if (carClass) params.set('class', carClass);
    
    // Add sort parameter if not default
    if (sort !== 'price-asc') params.set('sort', sort);
    
    // Update URL without causing a page reload
    const newURL = params.toString() ? `?${params.toString()}` : window.location.pathname;
    router.replace(newURL, { scroll: false });
  }, [filters, search, priceRange, year, carClass, sort, router, defaultPriceRange]);

  // Debounced URL update
  useEffect(() => {
    const timeoutId = setTimeout(updateURL, 300);
    return () => clearTimeout(timeoutId);
  }, [updateURL]);

  // Wrapper functions that update state and URL
  const setFilters = useCallback((newFilters: CarFilters) => {
    setFiltersState(newFilters);
  }, []);

  const setSearch = useCallback((newSearch: string) => {
    setSearchState(newSearch);
  }, []);

  const setPriceRange = useCallback((newRange: [number, number]) => {
    setPriceRangeState(newRange);
  }, []);

  const setYear = useCallback((newYear: number | undefined) => {
    setYearState(newYear);
  }, []);

  const setCarClass = useCallback((newCarClass: string | undefined) => {
    setCarClassState(newCarClass);
  }, []);

  const setSort = useCallback((newSort: SortOption) => {
    setSortState(newSort);
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState({});
    setSearchState('');
    setPriceRangeState(defaultPriceRange);
    setYearState(undefined);
    setCarClassState(undefined);
    setSortState('price-asc');
    router.replace(window.location.pathname, { scroll: false });
  }, [defaultPriceRange, router]);

  return {
    filters,
    search,
    priceRange,
    year,
    carClass,
    sort,
    setFilters,
    setSearch,
    setPriceRange,
    setYear,
    setCarClass,
    setSort,
    resetFilters,
    activeFiltersCount,
    updateURL,
  };
}