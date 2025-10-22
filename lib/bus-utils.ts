import { Bus, BusFilters, BusSortOption } from './types';

export function filterAndSortBuses(
  buses: Bus[],
  filters: BusFilters,
  searchQuery: string,
  sortBy: BusSortOption
): Bus[] {
  let filteredBuses = [...buses];

  // Apply search filter
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim();
    filteredBuses = filteredBuses.filter(bus =>
      bus.brand.toLowerCase().includes(query) ||
      bus.model.toLowerCase().includes(query) ||
      bus.type.toLowerCase().includes(query) ||
      `${bus.brand} ${bus.model}`.toLowerCase().includes(query)
    );
  }

  // Apply price range filter
  if (filters.priceRange) {
    const [min, max] = filters.priceRange;
    filteredBuses = filteredBuses.filter(bus =>
      bus.dailyPrice >= min && bus.dailyPrice <= max
    );
  }

  // Apply year filter
  if (filters.year) {
    const [minYear, maxYear] = filters.year;
    filteredBuses = filteredBuses.filter(bus =>
      bus.year >= minYear && bus.year <= maxYear
    );
  }

  // Apply capacity filter
  if (filters.capacity) {
    const [minCapacity, maxCapacity] = filters.capacity;
    filteredBuses = filteredBuses.filter(bus =>
      bus.capacity >= minCapacity && bus.capacity <= maxCapacity
    );
  }

  // Apply category filter
  if (filters.category?.length) {
    filteredBuses = filteredBuses.filter(bus =>
      filters.category!.some(category => 
        bus.type.toLowerCase().includes(category.toLowerCase())
      )
    );
  }

  // Apply type filter
  if (filters.type?.length) {
    filteredBuses = filteredBuses.filter(bus =>
      filters.type!.includes(bus.type)
    );
  }

  // Apply fuel type filter
  if (filters.fuelType?.length) {
    filteredBuses = filteredBuses.filter(bus =>
      filters.fuelType!.includes(bus.fuelType)
    );
  }

  // Apply transmission filter
  if (filters.transmission?.length) {
    filteredBuses = filteredBuses.filter(bus =>
      filters.transmission!.includes(bus.transmission)
    );
  }

  // Apply features filter
  if (filters.features?.length) {
    filteredBuses = filteredBuses.filter(bus =>
      filters.features!.every(feature =>
        bus.features.some(busFeature =>
          busFeature.toLowerCase().includes(feature.toLowerCase())
        )
      )
    );
  }

  // Apply availability filter
  if (filters.availability !== undefined) {
    // For now, assume all buses are available
    // This can be enhanced with real availability data
    filteredBuses = filteredBuses.filter(() => filters.availability);
  }

  // Apply sorting
  filteredBuses.sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.dailyPrice - b.dailyPrice;
      case 'price-desc':
        return b.dailyPrice - a.dailyPrice;
      case 'year-asc':
        return a.year - b.year;
      case 'year-desc':
        return b.year - a.year;
      case 'capacity-asc':
        return a.capacity - b.capacity;
      case 'capacity-desc':
        return b.capacity - a.capacity;
      case 'name':
        return `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`);
      case 'popularity':
      default:
        // For popularity, we can use a combination of factors
        // For now, sort by year (newer first) then by price (lower first)
        const yearDiff = b.year - a.year;
        if (yearDiff !== 0) return yearDiff;
        return a.dailyPrice - b.dailyPrice;
    }
  });

  return filteredBuses;
}

export function getBusCategories(buses: Bus[]): string[] {
  const categories = new Set<string>();
  buses.forEach(bus => {
    categories.add(bus.type);
  });
  return Array.from(categories).sort();
}

export function getBusBrands(buses: Bus[]): string[] {
  const brands = new Set<string>();
  buses.forEach(bus => {
    brands.add(bus.brand);
  });
  return Array.from(brands).sort();
}

export function getBusFeatures(buses: Bus[]): string[] {
  const features = new Set<string>();
  buses.forEach(bus => {
    bus.features.forEach(feature => {
      features.add(feature);
    });
  });
  return Array.from(features).sort();
}

export function getBusPriceRange(buses: Bus[]): [number, number] {
  if (buses.length === 0) return [0, 1000];
  
  const prices = buses.map(bus => bus.dailyPrice);
  return [Math.min(...prices), Math.max(...prices)];
}

export function getBusYearRange(buses: Bus[]): [number, number] {
  if (buses.length === 0) return [2020, new Date().getFullYear()];
  
  const years = buses.map(bus => bus.year);
  return [Math.min(...years), Math.max(...years)];
}

export function getBusCapacityRange(buses: Bus[]): [number, number] {
  if (buses.length === 0) return [10, 60];
  
  const capacities = buses.map(bus => bus.capacity);
  return [Math.min(...capacities), Math.max(...capacities)];
}