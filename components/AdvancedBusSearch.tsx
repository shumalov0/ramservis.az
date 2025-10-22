'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Bus } from '@/lib/types';
import { getBusBrands, getBusCategories } from '@/lib/bus-utils';

interface AdvancedBusSearchProps {
  search: string;
  onSearchChange: (search: string) => void;
  buses: Bus[];
  onQuickFilter: (filter: { key: string; value: string }) => void;
}

export default function AdvancedBusSearch({
  search,
  onSearchChange,
  buses,
  onQuickFilter,
}: AdvancedBusSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<{ type: string; value: string; label: string }>>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const brands = getBusBrands(buses);
  const categories = getBusCategories(buses);

  useEffect(() => {
    if (search.trim() && isOpen) {
      const query = search.toLowerCase();
      const newSuggestions: Array<{ type: string; value: string; label: string }> = [];

      // Brand suggestions
      brands.forEach(brand => {
        if (brand.toLowerCase().includes(query)) {
          newSuggestions.push({
            type: 'brand',
            value: brand,
            label: `Marka: ${brand}`
          });
        }
      });

      // Category suggestions
      categories.forEach(category => {
        if (category.toLowerCase().includes(query)) {
          newSuggestions.push({
            type: 'type',
            value: category,
            label: `Növ: ${category}`
          });
        }
      });

      // Bus model suggestions
      buses.forEach(bus => {
        const fullName = `${bus.brand} ${bus.model}`;
        if (fullName.toLowerCase().includes(query) && !newSuggestions.some(s => s.label.includes(fullName))) {
          newSuggestions.push({
            type: 'model',
            value: fullName,
            label: `Avtobus: ${fullName}`
          });
        }
      });

      setSuggestions(newSuggestions.slice(0, 8));
    } else {
      setSuggestions([]);
    }
  }, [search, isOpen, brands, categories, buses]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSuggestionClick = (suggestion: { type: string; value: string; label: string }) => {
    if (suggestion.type === 'brand' || suggestion.type === 'type') {
      onQuickFilter({ key: suggestion.type, value: suggestion.value });
      onSearchChange('');
    } else {
      onSearchChange(suggestion.value);
    }
    setIsOpen(false);
  };

  const clearSearch = () => {
    onSearchChange('');
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Avtobus axtarın (marka, model, növ)..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="w-full pl-12 pr-12 py-4 text-lg border border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent shadow-lg"
        />
        {search && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-900 dark:text-white">{suggestion.label}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}