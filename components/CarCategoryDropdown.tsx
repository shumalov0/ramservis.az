'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { createNavigationHandler } from '@/lib/navigation-utils';
import { ChevronDown, Car } from 'lucide-react';
import { CarCategory } from '@/lib/types';
import { carCategories } from '@/lib/data';

interface CarCategoryDropdownProps {
  currentLang: string;
  isScrolled?: boolean;
}

const CarCategoryDropdown: React.FC<CarCategoryDropdownProps> = ({ 
  currentLang, 
  isScrolled = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle mouse enter for both trigger and dropdown
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsHovering(true);
    setIsOpen(true);
  };

  // Handle mouse leave with delay - only close if not hovering over dropdown
  const handleMouseLeave = () => {
    setIsHovering(false);
    timeoutRef.current = setTimeout(() => {
      if (!isHovering) {
        setIsOpen(false);
      }
    }, 150);
  };

  // Handle dropdown mouse enter to keep it open
  const handleDropdownMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsHovering(true);
  };

  // Handle dropdown mouse leave
  const handleDropdownMouseLeave = () => {
    setIsHovering(false);
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Removed document event listeners to prevent navigation interference
  // Using only hover-based interactions now

  // Simplified keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  // Get localized category names
  const getLocalizedCategoryName = (category: CarCategory) => {
    // For now, return the displayName. In a full implementation,
    // this would use the translation system
    return category.displayName;
  };

  return (
    <div 
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={dropdownRef}
    >
      {/* Trigger Button */}
      <button
        className={`relative group font-semibold tracking-wide flex items-center space-x-1 ${
          isScrolled
            ? "text-gray-800 dark:text-gray-200"
            : "text-white"
        } transition-colors duration-200`}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Car categories menu"
      >
        <span className="duration-75 group-hover:text-brand-gold dark:group-hover:text-brand-gold">
          Maşınlar
        </span>
        <ChevronDown 
          className={`h-4 w-4 transition-transform duration-150 ${
            isOpen ? 'rotate-180' : ''
          } group-hover:text-brand-gold`}
        />
        
        {/* Premium underline */}
        <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gradient-to-r from-brand-gold via-yellow-400 to-brand-gold transition-all duration-200 group-hover:w-full rounded-full shadow-[0_0_8px_rgba(245,183,84,0.8)]"></span>
      </button>

      {/* Invisible bridge to prevent gap issues */}
      <div 
        className={`absolute top-full left-0 w-96 h-1 ${isOpen ? 'block' : 'hidden'}`}
        onMouseEnter={handleDropdownMouseEnter}
        onMouseLeave={handleDropdownMouseLeave}
      />

      {/* Dropdown Menu */}
      <div
        className={`absolute top-full left-0 mt-1 w-96 bg-white dark:bg-[#1a1a1a] rounded-lg shadow-xl border border-gray-200 dark:border-[#2a2a2a] z-50 transition-all duration-150 ${
          isOpen 
            ? 'opacity-100 visible translate-y-0' 
            : 'opacity-0 invisible -translate-y-2'
        }`}
        role="menu"
        aria-orientation="vertical"
        onMouseEnter={handleDropdownMouseEnter}
        onMouseLeave={handleDropdownMouseLeave}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 dark:border-[#2a2a2a]">
          <div className="flex items-center space-x-2">
            <Car className="h-5 w-5 text-brand-gold" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Maşın Kateqoriyaları
            </h3>
          </div>
        </div>

        {/* Categories List - 2 Column Grid */}
        <div className="py-2 px-2">
          <div className="grid grid-cols-2 gap-1">
            {carCategories.map((category) => (
              <a
                key={category.id}
                href={`/cars?category=${category.displayName}`}
                onClick={(e) => {
                  setIsOpen(false);
                  setIsHovering(false);
                  createNavigationHandler(`/cars?category=${category.displayName}`)(e);
                }}
                className="flex items-center px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 group cursor-pointer rounded-md"
                role="menuitem"
              >
                {/* Category Icon */}
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-brand-gold/20 to-yellow-400/20 rounded-lg flex items-center justify-center mr-2.5 group-hover:from-brand-gold/30 group-hover:to-yellow-400/30 transition-colors">
                  <span className="text-sm">{category.icon}</span>
                </div>
                
                {/* Category Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm text-gray-900 dark:text-white group-hover:text-brand-gold transition-colors leading-tight">
                      {getLocalizedCategoryName(category)}
                    </h4>
                    {category.count && (
                      <span className="text-xs bg-gray-100 dark:bg-slate-600 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded-full ml-1">
                        {category.count}
                      </span>
                    )}
                  </div>
                  {category.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                      {category.description}
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200 dark:border-[#2a2a2a]">
          <a
            href="/cars"
            onClick={(e) => {
              setIsOpen(false);
              setIsHovering(false);
              createNavigationHandler("/cars")(e);
            }}
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-brand-gold hover:text-brand-gold/80 hover:bg-brand-gold/5 rounded-md transition-colors duration-150 cursor-pointer"
          >
            Bütün Maşınları Gör
            <ChevronDown className="h-4 w-4 ml-1 rotate-[-90deg]" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default CarCategoryDropdown;