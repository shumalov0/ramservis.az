'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  TrendingDown, 
  TrendingUp, 
  Calendar, 
  MapPin, 
  Star,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { EnhancedCar } from '@/lib/types';
import { PriceBreakdown, calculateRentalPrice, PriceCalculationOptions } from '@/lib/price-calculation';

interface PriceOption {
  id: string;
  title: string;
  description: string;
  options: PriceCalculationOptions;
  badge?: {
    text: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  recommended?: boolean;
}

interface PriceComparisonProps {
  car: EnhancedCar;
  baseOptions: PriceCalculationOptions;
  comparisonOptions?: PriceOption[];
  onOptionSelect?: (option: PriceOption, priceBreakdown: PriceBreakdown) => void;
  showSavings?: boolean;
  showRecommended?: boolean;
  className?: string;
}

export default function PriceComparison({
  car,
  baseOptions,
  comparisonOptions,
  onOptionSelect,
  showSavings = true,
  showRecommended = true,
  className = '',
}: PriceComparisonProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Generate default comparison options if none provided
  const defaultComparisonOptions: PriceOption[] = useMemo(() => {
    const pickup = new Date(baseOptions.pickupDate);
    const dropoff = new Date(baseOptions.dropoffDate);
    const days = Math.ceil((dropoff.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24));

    const options: PriceOption[] = [];

    // Office pickup/dropoff option (cheapest)
    options.push({
      id: 'office-pickup',
      title: 'Office Pickup',
      description: 'Pick up and return at our office location',
      options: {
        ...baseOptions,
        pickupLocation: 'office',
        dropoffLocation: 'office',
        additionalServices: [],
      },
      badge: { text: 'Cheapest', variant: 'default' },
    });

    // Airport option (convenient)
    options.push({
      id: 'airport-pickup',
      title: 'Airport Pickup',
      description: 'Convenient airport pickup and dropoff',
      options: {
        ...baseOptions,
        pickupLocation: 'airport',
        dropoffLocation: 'airport',
        additionalServices: [],
      },
      badge: { text: 'Convenient', variant: 'secondary' },
    });

    // Full service option (premium)
    options.push({
      id: 'full-service',
      title: 'Full Service',
      description: 'Airport pickup with GPS and full insurance',
      options: {
        ...baseOptions,
        pickupLocation: 'airport',
        dropoffLocation: 'airport',
        additionalServices: ['gps', 'insurance'],
      },
      badge: { text: 'Premium', variant: 'outline' },
      recommended: true,
    });

    // Long-term discount option (if applicable)
    if (days >= 7) {
      options.push({
        id: 'long-term',
        title: 'Long-term Rental',
        description: 'Extended rental with automatic discount',
        options: {
          ...baseOptions,
          pickupLocation: 'office',
          dropoffLocation: 'office',
          additionalServices: ['insurance'],
        },
        badge: { text: 'Best Value', variant: 'default' },
      });
    }

    return options;
  }, [baseOptions]);

  const optionsToShow = comparisonOptions || defaultComparisonOptions;

  // Calculate prices for all options
  const priceComparisons = useMemo(() => {
    const basePrice = calculateRentalPrice(car, baseOptions);
    
    return optionsToShow.map(option => {
      try {
        const price = calculateRentalPrice(car, option.options);
        const savings = basePrice.total - price.total;
        const savingsPercentage = basePrice.total > 0 ? (savings / basePrice.total) * 100 : 0;
        
        return {
          ...option,
          price,
          savings,
          savingsPercentage,
          isError: false,
        };
      } catch (error) {
        return {
          ...option,
          price: null,
          savings: 0,
          savingsPercentage: 0,
          isError: true,
          error: error instanceof Error ? error.message : 'Calculation failed',
        };
      }
    });
  }, [car, baseOptions, optionsToShow]);

  // Sort by price (cheapest first)
  const sortedComparisons = useMemo(() => {
    return [...priceComparisons].sort((a, b) => {
      if (!a.price || !b.price) return 0;
      return a.price.total - b.price.total;
    });
  }, [priceComparisons]);

  const handleOptionSelect = (option: PriceOption, priceBreakdown: PriceBreakdown) => {
    setSelectedOption(option.id);
    if (onOptionSelect) {
      onOptionSelect(option, priceBreakdown);
    }
  };

  const formatPrice = (amount: number): string => {
    return new Intl.NumberFormat('az-AZ', {
      style: 'currency',
      currency: 'AZN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatSavings = (savings: number, percentage: number): string => {
    if (savings > 0) {
      return `Save ${formatPrice(savings)} (${percentage.toFixed(0)}%)`;
    } else if (savings < 0) {
      return `+${formatPrice(Math.abs(savings))} (${Math.abs(percentage).toFixed(0)}% more)`;
    }
    return 'Same price';
  };

  const getSavingsIcon = (savings: number) => {
    if (savings > 0) return <TrendingDown className="h-4 w-4 text-green-500" />;
    if (savings < 0) return <TrendingUp className="h-4 w-4 text-red-500" />;
    return <Info className="h-4 w-4 text-gray-500" />;
  };

  const getSavingsColor = (savings: number) => {
    if (savings > 0) return 'text-green-600 dark:text-green-400';
    if (savings < 0) return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Compare Pricing Options
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Choose the option that best fits your needs and budget
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedComparisons.map((comparison, index) => (
          <Card 
            key={comparison.id}
            className={`relative transition-all duration-200 hover:shadow-lg cursor-pointer ${
              selectedOption === comparison.id 
                ? 'ring-2 ring-blue-500 shadow-lg' 
                : 'hover:shadow-md'
            } ${
              comparison.recommended && showRecommended
                ? 'border-blue-500 dark:border-blue-400'
                : ''
            }`}
            onClick={() => comparison.price && handleOptionSelect(comparison, comparison.price)}
          >
            {/* Recommended Badge */}
            {comparison.recommended && showRecommended && (
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-500 text-white">
                  <Star className="h-3 w-3 mr-1" />
                  Recommended
                </Badge>
              </div>
            )}

            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{comparison.title}</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {comparison.description}
                  </p>
                </div>
                {comparison.badge && (
                  <Badge variant={comparison.badge.variant} className="ml-2">
                    {comparison.badge.text}
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              {comparison.isError ? (
                <div className="text-center py-4">
                  <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {comparison.isError && 'error' in comparison ? comparison.error : 'Calculation failed'}
                  </p>
                </div>
              ) : comparison.price ? (
                <div className="space-y-3">
                  {/* Price Display */}
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatPrice(comparison.price.total)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatPrice(comparison.price.total / comparison.price.days)}/day
                    </div>
                    <div className="text-xs text-red-600 dark:text-red-400">
                      + {formatPrice(comparison.price.deposit)} deposit
                    </div>
                  </div>

                  {/* Savings Display */}
                  {showSavings && comparison.savings !== 0 && (
                    <div className={`text-center text-sm ${getSavingsColor(comparison.savings)}`}>
                      <div className="flex items-center justify-center gap-1">
                        {getSavingsIcon(comparison.savings)}
                        <span>{formatSavings(comparison.savings, comparison.savingsPercentage)}</span>
                      </div>
                    </div>
                  )}

                  <Separator />

                  {/* Key Features */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-300">
                        {comparison.options.pickupLocation === 'airport' ? 'Airport' : 
                         comparison.options.pickupLocation === 'office' ? 'Office' : 'Custom'} pickup
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-300">
                        {comparison.price.days} day{comparison.price.days !== 1 ? 's' : ''}
                      </span>
                    </div>

                    {comparison.options.additionalServices && comparison.options.additionalServices.length > 0 && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span className="text-gray-600 dark:text-gray-300">
                          {comparison.options.additionalServices.length} service{comparison.options.additionalServices.length !== 1 ? 's' : ''} included
                        </span>
                      </div>
                    )}

                    {comparison.price.discounts > 0 && (
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-3 w-3 text-green-500" />
                        <span className="text-green-600 dark:text-green-400">
                          {formatPrice(comparison.price.discounts)} discount applied
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Selection Indicator */}
                  {selectedOption === comparison.id && (
                    <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-medium">
                      <CheckCircle className="h-4 w-4" />
                      Selected
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary */}
      {selectedOption && (
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">
                {sortedComparisons.find(c => c.id === selectedOption)?.title} selected
              </span>
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
              {sortedComparisons.find(c => c.id === selectedOption)?.description}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}