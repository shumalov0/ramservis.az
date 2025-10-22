'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import FixedHeader from '@/components/FixedHeader';
import Footer from '@/components/Footer';
import { buses } from '@/lib/data';
import { useTranslation } from '@/lib/translations';
import { BusFilters } from '@/lib/types';
import BusesSection from '@/components/BusesSection';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useBusFilters } from '@/hooks/use-bus-filters';
import { usePagination } from '@/hooks/use-pagination';
import { filterAndSortBuses } from '@/lib/bus-utils';
import LoadingSpinner from '@/components/LoadingSpinner';
import Pagination from '@/components/Pagination';
import AdvancedBusSearch from '@/components/AdvancedBusSearch';
import BusFilterSidebar from '@/components/BusFilterSidebar';

export default function BusesPage() {
  const [currentLang, setCurrentLang] = useState('az');
  const t = useTranslation(currentLang);
  const params = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  // Calculate default price range from buses data
  const defaultPriceRange = useMemo<[number, number]>(() => {
    const prices = buses.map(b => b.dailyPrice);
    return [Math.min(...prices), Math.max(...prices)];
  }, []);

  // Use the enhanced bus filters hook
  const {
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
  } = useBusFilters(defaultPriceRange);

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
    // if navigated with type from categories, preset type filter
    const type = params?.get('type');
    if (type) setBusType(type);
    
    // if navigated with category from dropdown, preset category filter
    const category = params?.get('category');
    if (category) {
      setFilters({
        ...filters,
        category: [category]
      });
    }
  }, [params, filters, setBusType, setFilters]);

  const handleLanguageChange = (lang: string) => {
    setCurrentLang(lang);
    localStorage.setItem('ramservis_language', lang);
  };

  const getLocalizedBusType = (busType: string) => {
    const typeMap: Record<string, Record<string, string>> = {
      'Minibus': { az: 'Minibus', en: 'Minibus', ru: 'Минибус' },
      'Coach': { az: 'Avtobus', en: 'Coach', ru: 'Автобус' },
      'Tour Bus': { az: 'Tur Avtobusu', en: 'Tour Bus', ru: 'Туристический автобус' },
      'City Bus': { az: 'Şəhər Avtobusu', en: 'City Bus', ru: 'Городской автобус' },
      'Luxury Bus': { az: 'Lüks Avtobus', en: 'Luxury Bus', ru: 'Люкс автобус' },
    };
    return typeMap[busType]?.[currentLang] || busType;
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
      'Mexaniki': { az: 'Mexaniki', en: 'Manual', ru: 'Механика' },
    };
    return transmissionMap[transmission]?.[currentLang] || transmission;
  };

  // Filter and sort buses using the enhanced utility function
  const filteredAndSortedBuses = useMemo(() => {
    // Combine legacy filters with new filter system
    const combinedFilters = {
      ...filters,
      priceRange,
      year: year ? [year, new Date().getFullYear()] as [number, number] : undefined,
      type: busType ? [busType] : undefined,
    };

    return filterAndSortBuses(buses, combinedFilters, debouncedSearch, sort);
  }, [filters, priceRange, year, busType, debouncedSearch, sort]);

  // Pagination for filtered results
  const {
    currentPage,
    itemsPerPage,
    totalPages,
    setCurrentPage,
    setItemsPerPage,
    paginatedItems,
  } = usePagination({
    totalItems: filteredAndSortedBuses.length,
    initialItemsPerPage: 12,
  });

  // Get paginated buses
  const paginatedBuses = paginatedItems(filteredAndSortedBuses);

  // Handle quick filter from advanced search
  const handleQuickFilter = (filter: { key: string; value: string }) => {
    if (filter.key === 'brand') {
      setSearch(filter.value);
    } else if (filter.key === 'type') {
      setBusType(filter.value);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-gray-50 dark:from-zinc-800 dark:bg-brand-dark/70 transition-colors duration-300">
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
                Avtobus {" "}
                <span className="text-brand-gold">Parkımız</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Geniş avtobus seçimimizdən sizə uyğun olanı tapın və qrup səyahətinizi təmin edin.
              </p>
            </div>

            {/* Advanced Search */}
            <div className="mb-8 max-w-2xl mx-auto">
              <AdvancedBusSearch
                search={search}
                onSearchChange={setSearch}
                buses={buses}
                onQuickFilter={handleQuickFilter}
              />
            </div>

            {/* Main Content Layout */}
            <div className="flex gap-8">
              {/* Filter Sidebar */}
              <BusFilterSidebar
                buses={buses}
                search={search}
                onSearchChange={setSearch}
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
                year={year}
                onYearChange={setYear}
                busType={busType}
                onBusTypeChange={setBusType}
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
                      {filteredAndSortedBuses.length} avtobus tapıldı
                      {activeFiltersCount > 0 && (
                        <span className="ml-2 text-brand-gold">
                          ({activeFiltersCount} filtr tətbiq edilib)
                        </span>
                      )}
                    </p>
                    {filteredAndSortedBuses.length > itemsPerPage && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Səhifə {currentPage} / {totalPages}
                      </p>
                    )}
                  </div>
                  
                  {filteredAndSortedBuses.length > itemsPerPage && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      totalItems={filteredAndSortedBuses.length}
                      itemsPerPage={itemsPerPage}
                      onPageChange={setCurrentPage}
                      onItemsPerPageChange={setItemsPerPage}
                      showItemsPerPage={false}
                      className="justify-end"
                    />
                  )}
                </div>

                {/* Buses List */}
                {filteredAndSortedBuses.length > 0 ? (
                  <>
                    <BusesSection 
                      buses={paginatedBuses} 
                      t={t} 
                      currentLang={currentLang} 
                      getLocalizedBusType={getLocalizedBusType} 
                      getLocalizedFuelType={getLocalizedFuelType} 
                      getLocalizedTransmission={getLocalizedTransmission}
                      showViewAllButton={false}
                      showTitle={false}
                    />
                    
                    {/* Bottom Pagination */}
                    {filteredAndSortedBuses.length > itemsPerPage && (
                      <div className="mt-12 flex justify-center">
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          totalItems={filteredAndSortedBuses.length}
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
                      <div className="text-6xl mb-4">🚌</div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Heç bir avtobus tapılmadı
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