'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Trash2, 
  Filter,
  SortAsc,
  Grid3X3,
  List,
  Heart
} from 'lucide-react';
import { useFavorites } from '@/hooks/use-favorites';
import { enhancedCars } from '@/lib/data';
import { EnhancedCar } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CarCard from '@/components/CarCard';
import { translations } from '@/lib/translations';
import Link from 'next/link';
import { Card, CardContent } from '../ui/card';

type ViewMode = 'grid' | 'list';
type SortOption = 'name' | 'price-low' | 'price-high' | 'year-new' | 'year-old' | 'category';
type FilterOption = 'all' | 'economy' | 'business' | 'luxury' | 'suv';

interface FavoritesManagerProps {
  showHeader?: boolean;
  maxItems?: number;
  compact?: boolean;
  currentLang?: string;
}

export default function FavoritesManager({ 
  showHeader = true, 
  maxItems,
  compact = false,
  currentLang = 'en'
}: FavoritesManagerProps) {
  const { favoriteIds, toggleFavorite } = useFavorites();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const t = translations[currentLang] || translations.en;

  // Localization functions
  const getLocalizedCarClass = (carClass: string) => {
    const classMap: { [key: string]: { [lang: string]: string } } = {
      'Economy': { az: 'Ekonom', en: 'Economy', ru: 'Эконом', ar: 'اقتصادي' },
      'Compact': { az: 'Kompakt', en: 'Compact', ru: 'Компактный', ar: 'مدمج' },
      'Standard': { az: 'Standart', en: 'Standard', ru: 'Стандартный', ar: 'قياسي' },
      'Premium': { az: 'Premium', en: 'Premium', ru: 'Премиум', ar: 'بريميوم' },
      'Luxury': { az: 'Lüks', en: 'Luxury', ru: 'Люкс', ar: 'فاخر' },
      'SUV': { az: 'SUV', en: 'SUV', ru: 'Внедорожник', ar: 'دفع رباعي' }
    };
    return classMap[carClass]?.[currentLang] || carClass;
  };

  const getLocalizedFuelType = (fuelType: string) => {
    const fuelMap: { [key: string]: { [lang: string]: string } } = {
      'Petrol': { az: 'Benzin', en: 'Petrol', ru: 'Бензин', ar: 'بنزين' },
      'Diesel': { az: 'Dizel', en: 'Diesel', ru: 'Дизель', ar: 'ديزل' },
      'Electric': { az: 'Elektrik', en: 'Electric', ru: 'Электрический', ar: 'كهربائي' },
      'Hybrid': { az: 'Hibrid', en: 'Hybrid', ru: 'Гибрид', ar: 'هجين' }
    };
    return fuelMap[fuelType]?.[currentLang] || fuelType;
  };

  const getLocalizedTransmission = (transmission: string) => {
    const transmissionMap: { [key: string]: { [lang: string]: string } } = {
      'Manual': { az: 'Mexaniki', en: 'Manual', ru: 'Механическая', ar: 'يدوي' },
      'Automatic': { az: 'Avtomatik', en: 'Automatic', ru: 'Автоматическая', ar: 'أوتوماتيكي' }
    };
    return transmissionMap[transmission]?.[currentLang] || transmission;
  };

  // Get favorite cars data
  const favoriteCars = useMemo(() => {
    const cars = enhancedCars.filter(car => favoriteIds.includes(car.id));
    
    // Apply filter
    let filtered = cars;
    if (filterBy !== 'all') {
      filtered = cars.filter(car => 
        car.category.toLowerCase() === filterBy ||
        (filterBy === 'economy' && car.category.toLowerCase().includes('ekonom'))
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`);
        case 'price-low':
          return a.dailyPrice - b.dailyPrice;
        case 'price-high':
          return b.dailyPrice - a.dailyPrice;
        case 'year-new':
          return b.year - a.year;
        case 'year-old':
          return a.year - b.year;
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    return maxItems ? sorted.slice(0, maxItems) : sorted;
  }, [favoriteIds, sortBy, filterBy, maxItems]);

  const clearAllFavorites = () => {
    favoriteIds.forEach(id => toggleFavorite(id));
  };

  if (favoriteIds.length === 0) {
    return (
      <Card className="bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <Heart className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Favorites Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start adding cars to your favorites to see them here!
          </p>
          <Link href="/cars">
            <Button className="bg-amber-600 hover:bg-amber-700 text-white">
              Browse Cars
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {showHeader && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              My Favorites
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {favoriteCars.length} of {favoriteIds.length} cars
            </p>
          </div>

          {!compact && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFavorites}
                className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            </div>
          )}
        </div>
      )}

      {!compact && (
        <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
          {/* View Mode Toggle */}
          <div className="flex items-center space-x-1 border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Sort Options */}
          <div className="flex items-center space-x-2">
            <SortAsc className="h-4 w-4 text-gray-500" />
            <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="year-new">Newest First</SelectItem>
                <SelectItem value="year-old">Oldest First</SelectItem>
                <SelectItem value="category">Category</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filter Options */}
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={filterBy} onValueChange={(value: FilterOption) => setFilterBy(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="economy">Economy</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="luxury">Luxury</SelectItem>
                <SelectItem value="suv">SUV</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Cars Display */}
      <div className={
        viewMode === 'grid' 
          ? `grid grid-cols-1 ${compact ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'} gap-6`
          : 'space-y-4'
      }>
        {favoriteCars.map((car) => (
          <FavoriteCarCard 
            key={car.id} 
            car={car} 
            viewMode={viewMode}
            compact={compact}
            currentLang={currentLang}
            t={t}
            getLocalizedCarClass={getLocalizedCarClass}
            getLocalizedFuelType={getLocalizedFuelType}
            getLocalizedTransmission={getLocalizedTransmission}
          />
        ))}
      </div>

      {maxItems && favoriteCars.length === maxItems && favoriteIds.length > maxItems && (
        <div className="text-center">
          <Link href="/favorites">
            <Button variant="outline">
              View All {favoriteIds.length} Favorites
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

interface FavoriteCarCardProps {
  car: EnhancedCar;
  viewMode: ViewMode;
  compact: boolean;
  currentLang: string;
  t: any;
  getLocalizedCarClass: (carClass: string) => string;
  getLocalizedFuelType: (fuelType: string) => string;
  getLocalizedTransmission: (transmission: string) => string;
}

function FavoriteCarCard({ 
  car, 
  viewMode, 
  compact, 
  currentLang, 
  t, 
  getLocalizedCarClass, 
  getLocalizedFuelType, 
  getLocalizedTransmission 
}: FavoriteCarCardProps) {
  // For list view, we can keep a simplified version or also use CarCard
  if (viewMode === 'list') {
    return (
      <CarCard
        car={car}
        currentLang={currentLang}
        t={t}
        getLocalizedCarClass={getLocalizedCarClass}
        getLocalizedFuelType={getLocalizedFuelType}
        getLocalizedTransmission={getLocalizedTransmission}
      />
    );
  }

  // For grid view, use CarCard
  return (
    <CarCard
      car={car}
      currentLang={currentLang}
      t={t}
      getLocalizedCarClass={getLocalizedCarClass}
      getLocalizedFuelType={getLocalizedFuelType}
      getLocalizedTransmission={getLocalizedTransmission}
    />
  );
}