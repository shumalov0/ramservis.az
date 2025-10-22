'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Filter, X, Search } from 'lucide-react';
import { Bus, BusFilters, BusSortOption } from '@/lib/types';
import { getBusBrands, getBusCategories, getBusFeatures, getBusPriceRange, getBusYearRange, getBusCapacityRange } from '@/lib/bus-utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';

interface BusFilterSidebarProps {
  buses: Bus[];
  search: string;
  onSearchChange: (search: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  year: number | null;
  onYearChange: (year: number | null) => void;
  busType: string | null;
  onBusTypeChange: (type: string | null) => void;
  sort: BusSortOption;
  onSortChange: (sort: BusSortOption) => void;
  onReset: () => void;
  filters: BusFilters;
  onFiltersChange: (filters: BusFilters) => void;
  activeFiltersCount: number;
}

export default function BusFilterSidebar({
  buses,
  search,
  onSearchChange,
  priceRange,
  onPriceRangeChange,
  year,
  onYearChange,
  busType,
  onBusTypeChange,
  sort,
  onSortChange,
  onReset,
  filters,
  onFiltersChange,
  activeFiltersCount,
}: BusFilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    search: true,
    sort: true,
    price: true,
    type: true,
    year: false,
    capacity: false,
    features: false,
    fuel: false,
    transmission: false,
  });

  const brands = getBusBrands(buses);
  const categories = getBusCategories(buses);
  const features = getBusFeatures(buses);
  const [minPrice, maxPrice] = getBusPriceRange(buses);
  const [minYear, maxYear] = getBusYearRange(buses);
  const [minCapacity, maxCapacity] = getBusCapacityRange(buses);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    const currentCategories = filters.category || [];
    const newCategories = checked
      ? [...currentCategories, category]
      : currentCategories.filter(c => c !== category);
    
    onFiltersChange({
      ...filters,
      category: newCategories.length > 0 ? newCategories : undefined
    });
  };

  const handleFuelTypeChange = (fuelType: string, checked: boolean) => {
    const currentFuelTypes = filters.fuelType || [];
    const newFuelTypes = checked
      ? [...currentFuelTypes, fuelType]
      : currentFuelTypes.filter(f => f !== fuelType);
    
    onFiltersChange({
      ...filters,
      fuelType: newFuelTypes.length > 0 ? newFuelTypes : undefined
    });
  };

  const handleTransmissionChange = (transmission: string, checked: boolean) => {
    const currentTransmissions = filters.transmission || [];
    const newTransmissions = checked
      ? [...currentTransmissions, transmission]
      : currentTransmissions.filter(t => t !== transmission);
    
    onFiltersChange({
      ...filters,
      transmission: newTransmissions.length > 0 ? newTransmissions : undefined
    });
  };

  const handleFeatureChange = (feature: string, checked: boolean) => {
    const currentFeatures = filters.features || [];
    const newFeatures = checked
      ? [...currentFeatures, feature]
      : currentFeatures.filter(f => f !== feature);
    
    onFiltersChange({
      ...filters,
      features: newFeatures.length > 0 ? newFeatures : undefined
    });
  };

  const handleCapacityChange = (capacity: [number, number]) => {
    onFiltersChange({
      ...filters,
      capacity: capacity[0] === minCapacity && capacity[1] === maxCapacity ? undefined : capacity
    });
  };

  const FilterSection = ({ 
    title, 
    section, 
    children 
  }: { 
    title: string; 
    section: keyof typeof expandedSections; 
    children: React.ReactNode;
  }) => (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
      <button
        onClick={() => toggleSection(section)}
        className="flex items-center justify-between w-full text-left font-medium text-gray-900 dark:text-white hover:text-brand-gold transition-colors"
      >
        <span>{title}</span>
        {expandedSections[section] ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>
      {expandedSections[section] && (
        <div className="mt-4 space-y-3">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-80 flex-shrink-0">
      <Card className="p-6 sticky top-28">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-brand-gold" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Filtrlər</h3>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="bg-brand-gold/10 text-brand-gold">
                {activeFiltersCount}
              </Badge>
            )}
          </div>
          {activeFiltersCount > 0 && (
            <Button
              onClick={onReset}
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-4 h-4 mr-1" />
              Sıfırla
            </Button>
          )}
        </div>

        <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Search */}
          <FilterSection title="Axtarış" section="search">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Avtobus axtarın..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent"
              />
            </div>
          </FilterSection>

          {/* Sort */}
          <FilterSection title="Sıralama" section="sort">
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value as BusSortOption)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent"
            >
              <option value="popularity">Populyarlıq</option>
              <option value="price-asc">Qiymət: Aşağıdan Yuxarıya</option>
              <option value="price-desc">Qiymət: Yuxarıdan Aşağıya</option>
              <option value="year-asc">İl: Köhnədən Yeniyə</option>
              <option value="year-desc">İl: Yenidən Köhnəyə</option>
              <option value="capacity-asc">Tutum: Kiçikdən Böyüyə</option>
              <option value="capacity-desc">Tutum: Böyükdən Kiçiyə</option>
              <option value="name">Ad</option>
            </select>
          </FilterSection>

          {/* Price Range */}
          <FilterSection title="Qiymət Aralığı" section="price">
            <div className="space-y-4">
              <Slider
                value={priceRange}
                onValueChange={(value) => onPriceRangeChange(value as [number, number])}
                min={minPrice}
                max={maxPrice}
                step={10}
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>{priceRange[0]}₼</span>
                <span>{priceRange[1]}₼</span>
              </div>
            </div>
          </FilterSection>

          {/* Bus Type */}
          <FilterSection title="Avtobus Növü" section="type">
            <div className="space-y-2">
              {categories.map((category) => (
                <label key={category} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.category?.includes(category) || false}
                    onChange={(e) => handleCategoryChange(category, e.target.checked)}
                    className="rounded border-gray-300 text-brand-gold focus:ring-brand-gold"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{category}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Year */}
          <FilterSection title="İl" section="year">
            <select
              value={year || ''}
              onChange={(e) => onYearChange(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent"
            >
              <option value="">Bütün illər</option>
              {Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i).map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </FilterSection>

          {/* Capacity */}
          <FilterSection title="Tutum" section="capacity">
            <div className="space-y-4">
              <Slider
                value={filters.capacity || [minCapacity, maxCapacity]}
                onValueChange={(value) => handleCapacityChange(value as [number, number])}
                min={minCapacity}
                max={maxCapacity}
                step={1}
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>{filters.capacity?.[0] || minCapacity} nəfər</span>
                <span>{filters.capacity?.[1] || maxCapacity} nəfər</span>
              </div>
            </div>
          </FilterSection>

          {/* Fuel Type */}
          <FilterSection title="Yanacaq Növü" section="fuel">
            <div className="space-y-2">
              {['Dizel', 'Benzin'].map((fuelType) => (
                <label key={fuelType} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.fuelType?.includes(fuelType) || false}
                    onChange={(e) => handleFuelTypeChange(fuelType, e.target.checked)}
                    className="rounded border-gray-300 text-brand-gold focus:ring-brand-gold"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{fuelType}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Transmission */}
          <FilterSection title="Transmissiya" section="transmission">
            <div className="space-y-2">
              {['Avtomat', 'Mexaniki'].map((transmission) => (
                <label key={transmission} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.transmission?.includes(transmission) || false}
                    onChange={(e) => handleTransmissionChange(transmission, e.target.checked)}
                    className="rounded border-gray-300 text-brand-gold focus:ring-brand-gold"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{transmission}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Features */}
          <FilterSection title="Xüsusiyyətlər" section="features">
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {features.slice(0, 10).map((feature) => (
                <label key={feature} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.features?.includes(feature) || false}
                    onChange={(e) => handleFeatureChange(feature, e.target.checked)}
                    className="rounded border-gray-300 text-brand-gold focus:ring-brand-gold"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                </label>
              ))}
            </div>
          </FilterSection>
        </div>
      </Card>
    </div>
  );
}