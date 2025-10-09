'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import FixedHeader from '@/components/FixedHeader';
import Footer from '@/components/Footer';
import { cars } from '@/lib/data';
import { useTranslation } from '@/lib/translations';
import { CarFilters } from '@/lib/types';
import CarsSection from '@/components/CarsSection';
// Removed unused import
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useCarFilters } from '@/hooks/use-car-filters';
import { usePagination } from '@/hooks/use-pagination';
import { filterAndSortCars } from '@/lib/car-utils';
import LoadingSpinner from '@/components/LoadingSpinner';
import Pagination from '@/components/Pagination';
import AdvancedSearch from '@/components/AdvancedSearch';
import FilterSidebar from '@/components/FilterSidebar';

export default function CarsPage() {
  const [currentLang, setCurrentLang] = useState('az');
  const t = useTranslation(currentLang);
  const params = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  // Calculate default price range from cars data
  const defaultPriceRange = useMemo<[number, number]>(() => {
    const prices = cars.map(c => c.dailyPrice);
    return [Math.min(...prices), Math.max(...prices)];
  }, []);

  // Use the enhanced car filters hook
  const {
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
  } = useCarFilters(defaultPriceRange);

  const debouncedSearch = useDebouncedValue(search, 300);

  useEffect(() => {
    const savedLang = localStorage.getItem('ramservis_language');
    if (savedLang && ['az', 'en', 'ru', 'ar'].includes(savedLang)) {
      setCurrentLang(savedLang);
    }
    
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // if navigated with class from categories, preset class filter
    const cls = params?.get('class');
    if (cls) setCarClass(cls);
    
    // if navigated with category from dropdown, preset category filter
    const category = params?.get('category');
    if (category) {
      setFilters({
        ...filters,
        category: [category]
      });
    }
  }, [params?.toString(), setCarClass, setFilters]);

  const handleLanguageChange = (lang: string) => {
    setCurrentLang(lang);
    localStorage.setItem('ramservis_language', lang);
  };

  const getLocalizedCarClass = (carClass: string) => {
    const classMap: Record<string, Record<string, string>> = {
      'Ekonom': { az: 'Ekonom', en: 'Economy', ru: 'Эконом' },
      'Biznes': { az: 'Biznes', en: 'Business', ru: 'Бизнес' },
      'Premium': { az: 'Premium', en: 'Premium', ru: 'Премиум' },
      'Lüks': { az: 'Lüks', en: 'Luxury', ru: 'Люкс' },
      'Komfort': { az: 'Komfort', en: 'Comfort', ru: 'Комфорт' },
      'SUV': { az: 'SUV', en: 'SUV', ru: 'Внедорожник' },
    };
    return classMap[carClass]?.[currentLang] || carClass;
  };

  const getLocalizedFuelType = (fuelType: string) => {
    const fuelMap: Record<string, Record<string, string>> = {
      'Benzin': { az: 'Benzin', en: 'Gasoline', ru: 'Бензин' },
      'Dizel': { az: 'Dizel', en: 'Diesel', ru: 'Дизель' },
      'Hybrid': { az: 'Hibrid', en: 'Hybrid', ru: 'Гибрид' },
    };
    return fuelMap[fuelType]?.[currentLang] || fuelType;
  };

  const getLocalizedTransmission = (transmission: string) => {
    const transmissionMap: Record<string, Record<string, string>> = {
      'Avtomat': { az: 'Avtomat', en: 'Automatic', ru: 'Автомат' },
      'Mexanika': { az: 'Mexanika', en: 'Manual', ru: 'Механика' },
    };
    return transmissionMap[transmission]?.[currentLang] || transmission;
  };

  // Filter and sort cars using the enhanced utility function
  const filteredAndSortedCars = useMemo(() => {
    // Combine legacy filters with new filter system
    const combinedFilters = {
      ...filters,
      priceRange,
      year: year ? [year, new Date().getFullYear()] as [number, number] : undefined,
      class: carClass ? [carClass] : undefined,
    };

    return filterAndSortCars(cars, combinedFilters, debouncedSearch, sort);
  }, [filters, priceRange, year, carClass, debouncedSearch, sort]);

  // Pagination for filtered results
  const {
    currentPage,
    itemsPerPage,
    totalPages,
    setCurrentPage,
    setItemsPerPage,
    paginatedItems,
  } = usePagination({
    totalItems: filteredAndSortedCars.length,
    initialItemsPerPage: 12,
  });

  // Get paginated cars
  const paginatedCars = paginatedItems(filteredAndSortedCars);

  // Handle quick filter from advanced search
  const handleQuickFilter = (filter: { key: string; value: string }) => {
    if (filter.key === 'brand') {
      setSearch(filter.value);
    } else if (filter.key === 'class') {
      setCarClass(filter.value);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-gray-50 dark:from-zinc-800 dark:bg-brand-dark/70  transition-colors duration-300">
      <FixedHeader currentLang={currentLang} handleLanguageChange={handleLanguageChange} t={t} />
      
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[60vh]">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
<div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto">
    {/* Page Header */}
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        Maşın {" "}
        <span className="text-brand-gold">Parkımız</span>
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        Geniş maşın seçimimizdən sizə uyğun olanı tapın və rahat səyahətinizi təmin edin.
      </p>
    </div>

    {/* Advanced Search */}
    <div className="mb-8 max-w-2xl mx-auto">
      <AdvancedSearch
        search={search}
        onSearchChange={setSearch}
        cars={cars}
        onQuickFilter={handleQuickFilter}
      />
    </div>

    {/* Main Content Layout */}
    <div className="flex gap-8">
      {/* Filter Sidebar */}
      <FilterSidebar
        cars={cars}
        search={search}
        onSearchChange={setSearch}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        year={year}
        onYearChange={setYear}
        carClass={carClass}
        onCarClassChange={setCarClass}
        sort={sort}
        onSortChange={setSort}
        onReset={resetFilters}
        filters={filters}
        onFiltersChange={setFilters}
        activeFiltersCount={activeFiltersCount}
      />

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Results Summary and Pagination Top */}
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-gray-600 dark:text-gray-400">
              {filteredAndSortedCars.length} maşın tapıldı
              {activeFiltersCount > 0 && (
                <span className="ml-2 text-brand-gold">
                  ({activeFiltersCount} filtr tətbiq edilib)
                </span>
              )}
            </p>
            {filteredAndSortedCars.length > itemsPerPage && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Səhifə {currentPage} / {totalPages}
              </p>
            )}
          </div>
          
          {filteredAndSortedCars.length > itemsPerPage && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredAndSortedCars.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
              showItemsPerPage={false}
              className="justify-end"
            />
          )}
        </div>

        {/* Cars List */}
        {filteredAndSortedCars.length > 0 ? (
          <>
            <CarsSection 
              cars={paginatedCars} 
              t={t} 
              currentLang={currentLang} 
              getLocalizedCarClass={getLocalizedCarClass} 
              getLocalizedFuelType={getLocalizedFuelType} 
              getLocalizedTransmission={getLocalizedTransmission}
              showViewAllButton={false}
              showTitle={false}
            />
            
            {/* Bottom Pagination */}
            {filteredAndSortedCars.length > itemsPerPage && (
              <div className="mt-12 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredAndSortedCars.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={setItemsPerPage}
                  showItemsPerPage={true}
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">🚗</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Heç bir maşın tapılmadı
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Axtarış kriteriyalarınızı dəyişdirməyi və ya filtrləri sıfırlamağı cəhd edin.
              </p>
              <button
                onClick={resetFilters}
                className="bg-brand-gold hover:bg-brand-gold/90 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Filtrləri Sıfırla
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
</div>
      )}
      
      <Footer t={t} />
    </div>
  );
}