'use client';

import { useMemo, memo, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { enhancedCars } from '@/lib/data';
import { Car } from '@/lib/types';
import { CarFilters, EnhancedCar } from '@/lib/types';
import { Search, RotateCcw, Filter, X } from 'lucide-react';

export type SortOption = 'price-asc' | 'price-desc' | 'year-desc' | 'year-asc' | 'popularity';

interface CarsFiltersProps {
  cars: Car[];
  search: string;
  onSearchChange: (v: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (v: [number, number]) => void;
  year: number | undefined;
  onYearChange: (v: number | undefined) => void;
  carClass: string | undefined;
  onCarClassChange: (v: string | undefined) => void;
  sort: SortOption;
  onSortChange: (v: SortOption) => void;
  onReset: () => void;
  // Enhanced filtering props
  filters: CarFilters;
  onFiltersChange: (filters: CarFilters) => void;
  activeFiltersCount: number;
}

const CarsFilters = memo(function CarsFilters({
  cars,
  search,
  onSearchChange,
  priceRange,
  onPriceRangeChange,
  year,
  onYearChange,
  carClass,
  onCarClassChange,
  sort,
  onSortChange,
  onReset,
  filters,
  onFiltersChange,
  activeFiltersCount,
}: CarsFiltersProps) {
  const { minPrice, maxPrice, minYear, maxYear, classes, categories, fuelTypes, transmissions, features } = useMemo(() => {
    const prices = cars.map((c) => c.dailyPrice);
    const years = cars.map((c) => c.year);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    const classes = Array.from(new Set(cars.map((c) => c.class)));
    
    // Get enhanced data for additional filters
    const categories = Array.from(new Set(enhancedCars.flatMap((c) => c.category)));
    const fuelTypes = Array.from(new Set(cars.map((c) => c.fuelType)));
    const transmissions = Array.from(new Set(cars.map((c) => c.transmission)));
    const features = Array.from(new Set(cars.flatMap((c) => c.features)));
    
    return { minPrice, maxPrice, minYear, maxYear, classes, categories, fuelTypes, transmissions, features };
  }, [cars]);

  const handleCategoryChange = useCallback((category: string, checked: boolean) => {
    const newCategories = checked 
      ? [...(filters.category || []), category]
      : (filters.category || []).filter(c => c !== category);
    
    onFiltersChange({
      ...filters,
      category: newCategories.length > 0 ? newCategories : undefined
    });
  }, [filters, onFiltersChange]);

  const handleFuelTypeChange = useCallback((fuelType: string, checked: boolean) => {
    const newFuelTypes = checked 
      ? [...(filters.fuelType || []), fuelType]
      : (filters.fuelType || []).filter(f => f !== fuelType);
    
    onFiltersChange({
      ...filters,
      fuelType: newFuelTypes.length > 0 ? newFuelTypes : undefined
    });
  }, [filters, onFiltersChange]);

  const handleTransmissionChange = useCallback((transmission: string, checked: boolean) => {
    const newTransmissions = checked 
      ? [...(filters.transmission || []), transmission]
      : (filters.transmission || []).filter(t => t !== transmission);
    
    onFiltersChange({
      ...filters,
      transmission: newTransmissions.length > 0 ? newTransmissions : undefined
    });
  }, [filters, onFiltersChange]);

  const handleFeatureChange = useCallback((feature: string, checked: boolean) => {
    const newFeatures = checked 
      ? [...(filters.features || []), feature]
      : (filters.features || []).filter(f => f !== feature);
    
    onFiltersChange({
      ...filters,
      features: newFeatures.length > 0 ? newFeatures : undefined
    });
  }, [filters, onFiltersChange]);

  const clearFilter = useCallback((filterType: keyof CarFilters) => {
    onFiltersChange({
      ...filters,
      [filterType]: undefined
    });
  }, [filters, onFiltersChange]);

  return (
    <div className="rounded-2xl border border-gray-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-brand-dark/70 backdrop-blur p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Filtrlər</h3>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="bg-brand-gold/20 text-brand-gold text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={onReset} className="text-gray-600 dark:text-gray-300 hover:text-brand-gold">
          <RotateCcw className="h-4 w-4 mr-2" />Sıfırla
        </Button>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {filters.category?.map(category => (
            <Badge key={category} variant="outline" className="text-xs">
              {category}
              <button 
                onClick={() => clearFilter('category')}
                className="ml-1 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {filters.fuelType?.map(fuel => (
            <Badge key={fuel} variant="outline" className="text-xs">
              {fuel}
              <button 
                onClick={() => clearFilter('fuelType')}
                className="ml-1 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {filters.transmission?.map(trans => (
            <Badge key={trans} variant="outline" className="text-xs">
              {trans}
              <button 
                onClick={() => clearFilter('transmission')}
                className="ml-1 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <div className="space-y-4">
        {/* Search */}
        <div>
          <Label htmlFor="search" className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Axtarış</Label>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="search"
              placeholder="Marka və ya model"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Price Range */}
        <div>
          <div className="flex items-center justify-between">
            <Label className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Günlük qiymət</Label>
            <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">{priceRange[0]}₼ - {priceRange[1]}₼</span>
          </div>
          <div className="px-1 mt-3">
            <Slider
              min={minPrice}
              max={maxPrice}
              step={5}
              value={[priceRange[0], priceRange[1]]}
              onValueChange={(v) => onPriceRangeChange([v[0], v[1]] as [number, number])}
            />
          </div>
        </div>

        {/* Categories */}
        <div>
          <Label className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3 block">Kateqoriya</Label>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={filters.category?.includes(category) || false}
                  onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                />
                <Label htmlFor={`category-${category}`} className="text-sm text-gray-700 dark:text-gray-300">
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Fuel Type */}
        <div>
          <Label className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3 block">Yanacaq növü</Label>
          <div className="space-y-2">
            {fuelTypes.map((fuelType) => (
              <div key={fuelType} className="flex items-center space-x-2">
                <Checkbox
                  id={`fuel-${fuelType}`}
                  checked={filters.fuelType?.includes(fuelType) || false}
                  onCheckedChange={(checked) => handleFuelTypeChange(fuelType, checked as boolean)}
                />
                <Label htmlFor={`fuel-${fuelType}`} className="text-sm text-gray-700 dark:text-gray-300">
                  {fuelType}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Transmission */}
        <div>
          <Label className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3 block">Transmissiya</Label>
          <div className="space-y-2">
            {transmissions.map((transmission) => (
              <div key={transmission} className="flex items-center space-x-2">
                <Checkbox
                  id={`trans-${transmission}`}
                  checked={filters.transmission?.includes(transmission) || false}
                  onCheckedChange={(checked) => handleTransmissionChange(transmission, checked as boolean)}
                />
                <Label htmlFor={`trans-${transmission}`} className="text-sm text-gray-700 dark:text-gray-300">
                  {transmission}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Year and Class */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">İl (min)</Label>
            <Select onValueChange={(v) => onYearChange(v === '__all__' ? undefined : Number(v))} value={year ? String(year) : '__all__'}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Hamısı" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Hamısı</SelectItem>
                {Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i).map((y) => (
                  <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Sinif</Label>
            <Select onValueChange={(v) => onCarClassChange(v === '__all__' ? undefined : v)} value={carClass || '__all__'}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Hamısı" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Hamısı</SelectItem>
                {classes.map((cls) => (
                  <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Sorting */}
        <div>
          <Label className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Sıralama</Label>
          <Select onValueChange={(v) => onSortChange(v as SortOption)} value={sort}>
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price-asc">Ən ucuz</SelectItem>
              <SelectItem value="price-desc">Ən bahalı</SelectItem>
              <SelectItem value="year-desc">Ən yeni</SelectItem>
              <SelectItem value="year-asc">Ən köhnə</SelectItem>
              <SelectItem value="popularity">Populyarlıq</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Popular Features */}
        <div>
          <Label className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3 block">Xüsusiyyətlər</Label>
          <div className="grid grid-cols-2 gap-2">
            {features.slice(0, 6).map((feature) => (
              <div key={feature} className="flex items-center space-x-2">
                <Checkbox
                  id={`feature-${feature}`}
                  checked={filters.features?.includes(feature) || false}
                  onCheckedChange={(checked) => handleFeatureChange(feature, checked as boolean)}
                />
                <Label htmlFor={`feature-${feature}`} className="text-xs text-gray-700 dark:text-gray-300">
                  {feature}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export default CarsFilters;


