'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, X, Filter, SlidersHorizontal } from 'lucide-react';
import { Car } from '@/lib/types';

interface AdvancedSearchProps {
  search: string;
  onSearchChange: (search: string) => void;
  cars: Car[];
  onQuickFilter: (filter: { key: string; value: string }) => void;
  className?: string;
}

export default function AdvancedSearch({
  search,
  onSearchChange,
  cars,
  onQuickFilter,
  className = '',
}: AdvancedSearchProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ramservis_recent_searches');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Generate search suggestions based on current input
  const suggestions = search.length > 0 ? cars
    .filter(car => 
      `${car.brand} ${car.model}`.toLowerCase().includes(search.toLowerCase()) ||
      car.class.toLowerCase().includes(search.toLowerCase()) ||
      car.fuelType.toLowerCase().includes(search.toLowerCase())
    )
    .slice(0, 5)
    .map(car => ({
      type: 'car' as const,
      text: `${car.brand} ${car.model}`,
      subtitle: `${car.year} • ${car.class}`,
      car
    })) : [];

  // Popular search terms
  const popularSearches = [
    'BMW', 'Mercedes', 'Toyota', 'Hyundai',
    'SUV', 'Sedan', 'Premium', 'Ekonom'
  ];

  const handleSearchSubmit = (searchTerm: string) => {
    onSearchChange(searchTerm);
    setShowSuggestions(false);
    
    // Add to recent searches
    const newRecentSearches = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
    setRecentSearches(newRecentSearches);
    localStorage.setItem('ramservis_recent_searches', JSON.stringify(newRecentSearches));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('ramservis_recent_searches');
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Marka, model və ya xüsusiyyət axtarın..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          className="pl-10 pr-10 h-12 text-base"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search suggestions dropdown */}
      {showSuggestions && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {/* Current search suggestions */}
            {suggestions.length > 0 && (
              <div className="p-4 border-b">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Axtarış nəticələri
                </h4>
                <div className="space-y-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearchSubmit(suggestion.text)}
                      className="w-full text-left p-2 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] rounded-lg transition-colors"
                    >
                      <div className="font-medium text-gray-900 dark:text-white">
                        {suggestion.text}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {suggestion.subtitle}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Recent searches */}
            {recentSearches.length > 0 && (
              <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Son axtarışlar
                  </h4>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    Təmizlə
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((recentSearch, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                      onClick={() => handleSearchSubmit(recentSearch)}
                    >
                      {recentSearch}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Popular searches */}
            <div className="p-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Populyar axtarışlar
              </h4>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((popularSearch, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-brand-gold/10 hover:border-brand-gold"
                    onClick={() => handleSearchSubmit(popularSearch)}
                  >
                    {popularSearch}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Click outside to close suggestions */}
      {showSuggestions && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowSuggestions(false)}
        />
      )}
    </div>
  );
}