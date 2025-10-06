'use client';

import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, SlidersHorizontal } from 'lucide-react';
import CarsFilters, { SortOption } from '@/components/CarsFilters';
import { Car } from '@/lib/data';
import { CarFilters } from '@/lib/types';

interface FilterSidebarProps {
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
  filters: CarFilters;
  onFiltersChange: (filters: CarFilters) => void;
  activeFiltersCount: number;
}

export default function FilterSidebar({
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
}: FilterSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 flex-shrink-0">
        <div className="sticky top-6">
          <CarsFilters
            cars={cars}
            search={search}
            onSearchChange={onSearchChange}
            priceRange={priceRange}
            onPriceRangeChange={onPriceRangeChange}
            year={year}
            onYearChange={onYearChange}
            carClass={carClass}
            onCarClassChange={onCarClassChange}
            sort={sort}
            onSortChange={onSortChange}
            onReset={onReset}
            filters={filters}
            onFiltersChange={onFiltersChange}
            activeFiltersCount={activeFiltersCount}
          />
        </div>
      </div>

      {/* Mobile Filter Button */}
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              size="icon"
              className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full p-0 shadow-lg border-2 border-brand-gold/20 bg-white/90 dark:bg-brand-dark/90 backdrop-blur-sm hover:bg-brand-gold/10 hover:border-brand-gold/40 transition-all duration-200 hover:scale-105"
              aria-label="Filtrləri aç"
            >
              <SlidersHorizontal className="h-5 w-5 text-brand-gold" />
              {activeFiltersCount > 0 && (
                <Badge 
                  variant="secondary" 
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 flex items-center justify-center bg-brand-gold text-white text-xs font-bold"
                >
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full sm:w-80 overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtrlər
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="bg-brand-gold/20 text-brand-gold">
                    {activeFiltersCount}
                  </Badge>
                )}
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <CarsFilters
                cars={cars}
                search={search}
                onSearchChange={onSearchChange}
                priceRange={priceRange}
                onPriceRangeChange={onPriceRangeChange}
                year={year}
                onYearChange={onYearChange}
                carClass={carClass}
                onCarClassChange={onCarClassChange}
                sort={sort}
                onSortChange={onSortChange}
                onReset={() => {
                  onReset();
                  setIsOpen(false);
                }}
                filters={filters}
                onFiltersChange={onFiltersChange}
                activeFiltersCount={activeFiltersCount}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}