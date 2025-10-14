import { Car, enhancedCars } from './data';
import { CarFilters, EnhancedCar } from './types';
import { SortOption } from '@/components/CarsFilters';

/**
 * Filter cars based on the provided filters
 */
export function filterCars(cars: Car[], filters: CarFilters, search: string = ''): Car[] {
  return cars.filter((car) => {
    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      const matchesSearch = 
        car.brand.toLowerCase().includes(searchLower) ||
        car.model.toLowerCase().includes(searchLower) ||
        `${car.brand} ${car.model}`.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) return false;
    }

    // Price range filter
    if (filters.priceRange) {
      const [minPrice, maxPrice] = filters.priceRange;
      if (car.dailyPrice < minPrice || car.dailyPrice > maxPrice) {
        return false;
      }
    }

    // Year filter
    if (filters.year) {
      const [minYear, maxYear] = filters.year;
      if (car.year < minYear || car.year > maxYear) {
        return false;
      }
    }

    // Class filter (deprecated - use category instead)
    if (filters.class && filters.class.length > 0) {
      const enhancedCar = enhancedCars.find(ec => ec.id === car.id);
      if (!enhancedCar || !enhancedCar.category.some(cat => filters.class!.includes(cat))) {
        return false;
      }
    }

    // Fuel type filter
    if (filters.fuelType && filters.fuelType.length > 0) {
      if (!filters.fuelType.includes(car.fuelType)) {
        return false;
      }
    }

    // Transmission filter
    if (filters.transmission && filters.transmission.length > 0) {
      if (!filters.transmission.includes(car.transmission)) {
        return false;
      }
    }

    // Features filter
    if (filters.features && filters.features.length > 0) {
      const hasAllFeatures = filters.features.every(feature => 
        car.features.includes(feature)
      );
      if (!hasAllFeatures) {
        return false;
      }
    }

    // Category filter (using enhanced data)
    if (filters.category && filters.category.length > 0) {
      const enhancedCar = enhancedCars.find(ec => ec.id === car.id);
      if (!enhancedCar) {
        return false;
      }
      
      // Check if car's categories match any of the selected categories
      const carCategories = enhancedCar.category;
      if (!carCategories || !carCategories.some(cat => filters.category!.includes(cat))) {
        return false;
      }
    }

    // Seats filter
    if (filters.seats && filters.seats.length > 0) {
      if (!filters.seats.includes(car.seats)) {
        return false;
      }
    }

    // Availability filter
    if (filters.availability !== undefined) {
      const enhancedCar = enhancedCars.find(ec => ec.id === car.id);
      if (!enhancedCar || enhancedCar.availability !== filters.availability) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Sort cars based on the provided sort option
 */
export function sortCars(cars: Car[], sortOption: SortOption): Car[] {
  const sortedCars = [...cars];

  switch (sortOption) {
    case 'price-asc':
      return sortedCars.sort((a, b) => a.dailyPrice - b.dailyPrice);
    
    case 'price-desc':
      return sortedCars.sort((a, b) => b.dailyPrice - a.dailyPrice);
    
    case 'year-asc':
      return sortedCars.sort((a, b) => a.year - b.year);
    
    case 'year-desc':
      return sortedCars.sort((a, b) => b.year - a.year);
    
    case 'popularity':
      return sortedCars.sort((a, b) => {
        const enhancedA = enhancedCars.find(ec => ec.id === a.id);
        const enhancedB = enhancedCars.find(ec => ec.id === b.id);
        
        const popularityA = enhancedA?.popularity || 0;
        const popularityB = enhancedB?.popularity || 0;
        
        return popularityB - popularityA; // Higher popularity first
      });
    
    default:
      return sortedCars;
  }
}

/**
 * Filter and sort cars in one function
 */
export function filterAndSortCars(
  cars: Car[], 
  filters: CarFilters, 
  search: string, 
  sortOption: SortOption
): Car[] {
  const filtered = filterCars(cars, filters, search);
  return sortCars(filtered, sortOption);
}

/**
 * Get filter statistics for the current filter state
 */
export function getFilterStats(cars: Car[], filters: CarFilters, search: string) {
  const filteredCars = filterCars(cars, filters, search);
  
  return {
    totalCars: filteredCars.length,
    priceRange: {
      min: Math.min(...filteredCars.map(c => c.dailyPrice)),
      max: Math.max(...filteredCars.map(c => c.dailyPrice))
    },
    yearRange: {
      min: Math.min(...filteredCars.map(c => c.year)),
      max: Math.max(...filteredCars.map(c => c.year))
    },
    availableCategories: Array.from(new Set(
      filteredCars.map(car => {
        const enhanced = enhancedCars.find(ec => ec.id === car.id);
        return enhanced?.category;
      }).filter(Boolean)
    )),
    availableFuelTypes: Array.from(new Set(filteredCars.map(c => c.fuelType))),
    availableTransmissions: Array.from(new Set(filteredCars.map(c => c.transmission))),
    availableClasses: Array.from(new Set(filteredCars.map(c => c.class)))
  };
}

/**
 * Get popular filters based on car data
 */
export function getPopularFilters(cars: Car[]) {
  const categoryCount: Record<string, number> = {};
  const fuelTypeCount: Record<string, number> = {};
  const transmissionCount: Record<string, number> = {};
  const featureCount: Record<string, number> = {};

  cars.forEach(car => {
    // Count categories
    const enhanced = enhancedCars.find(ec => ec.id === car.id);
    if (enhanced?.category) {
      enhanced.category.forEach(cat => {
        categoryCount[cat] = (categoryCount[cat] || 0) + 1;
      });
    }

    // Count fuel types
    fuelTypeCount[car.fuelType] = (fuelTypeCount[car.fuelType] || 0) + 1;

    // Count transmissions
    transmissionCount[car.transmission] = (transmissionCount[car.transmission] || 0) + 1;

    // Count features
    car.features.forEach(feature => {
      featureCount[feature] = (featureCount[feature] || 0) + 1;
    });
  });

  return {
    popularCategories: Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([category, count]) => ({ category, count })),
    
    popularFuelTypes: Object.entries(fuelTypeCount)
      .sort(([,a], [,b]) => b - a)
      .map(([fuelType, count]) => ({ fuelType, count })),
    
    popularTransmissions: Object.entries(transmissionCount)
      .sort(([,a], [,b]) => b - a)
      .map(([transmission, count]) => ({ transmission, count })),
    
    popularFeatures: Object.entries(featureCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([feature, count]) => ({ feature, count }))
  };
}