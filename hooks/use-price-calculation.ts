import { useState, useEffect, useCallback, useMemo } from 'react';
import { EnhancedCar } from '@/lib/types';
import { 
  calculateRentalPrice, 
  PriceBreakdown, 
  PriceCalculationOptions,
  getPriceChangeNotifications,
  PriceChangeNotification,
  validateDiscountCode
} from '@/lib/price-calculation';
import { enhancedCars } from '@/lib/data';

export interface UsePriceCalculationOptions {
  carId?: string;
  pickupDate?: string;
  dropoffDate?: string;
  pickupLocation?: string;
  dropoffLocation?: string;
  additionalServices?: string[];
  discountCode?: string;
  paymentMethod?: 'cash' | 'card' | 'online';
  autoCalculate?: boolean; // Whether to automatically recalculate on changes
}

export interface UsePriceCalculationReturn {
  // Price data
  priceBreakdown: PriceBreakdown | null;
  isCalculating: boolean;
  error: string | null;
  
  // Price change tracking
  previousPrice: PriceBreakdown | null;
  priceChangeNotifications: PriceChangeNotification[];
  
  // Discount handling
  discountValidation: {
    isValid: boolean;
    error?: string;
    discount?: any;
  };
  
  // Actions
  calculatePrice: (options?: Partial<PriceCalculationOptions>) => void;
  clearError: () => void;
  clearNotifications: () => void;
  validateDiscount: (code: string) => void;
  
  // Utilities
  formatPrice: (amount: number) => string;
  isValidRentalPeriod: boolean;
  minimumRentalDays: number;
}

export const usePriceCalculation = (
  initialOptions: UsePriceCalculationOptions = {}
): UsePriceCalculationReturn => {
  const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdown | null>(null);
  const [previousPrice, setPreviousPrice] = useState<PriceBreakdown | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [priceChangeNotifications, setPriceChangeNotifications] = useState<PriceChangeNotification[]>([]);
  const [discountValidation, setDiscountValidation] = useState<{
    isValid: boolean;
    error?: string;
    discount?: any;
  }>({ isValid: false });

  const {
    carId,
    pickupDate,
    dropoffDate,
    pickupLocation = 'office',
    dropoffLocation = 'office',
    additionalServices = [],
    discountCode,
    paymentMethod = 'cash',
    autoCalculate = true
  } = initialOptions;

  // Get the selected car
  const selectedCar = useMemo(() => {
    if (!carId) return null;
    return enhancedCars.find(car => car.id === carId) || null;
  }, [carId]);

  // Check if rental period is valid
  const isValidRentalPeriod = useMemo(() => {
    if (!pickupDate || !dropoffDate) return false;
    
    const pickup = new Date(pickupDate);
    const dropoff = new Date(dropoffDate);
    const timeDiff = dropoff.getTime() - pickup.getTime();
    const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    return days >= 1;
  }, [pickupDate, dropoffDate]);

  const minimumRentalDays = 1;

  // Price calculation function
  const calculatePrice = useCallback((overrideOptions?: Partial<PriceCalculationOptions>) => {
    if (!selectedCar) {
      setError('No car selected');
      return;
    }

    if (!pickupDate || !dropoffDate) {
      setError('Pickup and dropoff dates are required');
      return;
    }

    if (!isValidRentalPeriod) {
      setError(`Minimum rental period is ${minimumRentalDays} day(s)`);
      return;
    }

    setIsCalculating(true);
    setError(null);

    try {
      const options: PriceCalculationOptions = {
        carId: selectedCar.id,
        pickupDate,
        dropoffDate,
        pickupLocation,
        dropoffLocation,
        additionalServices,
        discountCode,
        paymentMethod,
        ...overrideOptions,
      };

      const newPrice = calculateRentalPrice(selectedCar, options);
      
      // Track price changes
      if (priceBreakdown) {
        setPreviousPrice(priceBreakdown);
        const notifications = getPriceChangeNotifications(priceBreakdown, newPrice);
        setPriceChangeNotifications(notifications);
      }
      
      setPriceBreakdown(newPrice);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to calculate price';
      setError(errorMessage);
      setPriceBreakdown(null);
    } finally {
      setIsCalculating(false);
    }
  }, [
    selectedCar,
    pickupDate,
    dropoffDate,
    pickupLocation,
    dropoffLocation,
    additionalServices,
    discountCode,
    paymentMethod,
    isValidRentalPeriod,
    priceBreakdown,
    minimumRentalDays
  ]);

  // Validate discount code
  const validateDiscount = useCallback((code: string) => {
    const validation = validateDiscountCode(code);
    setDiscountValidation(validation);
  }, []);

  // Auto-calculate when dependencies change
  useEffect(() => {
    if (autoCalculate && selectedCar && pickupDate && dropoffDate && isValidRentalPeriod) {
      // Debounce the calculation to avoid excessive calls
      const timeoutId = setTimeout(() => {
        calculatePrice();
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [autoCalculate, selectedCar, pickupDate, dropoffDate, pickupLocation, dropoffLocation, additionalServices, discountCode, paymentMethod, isValidRentalPeriod, calculatePrice]);

  // Validate discount code when it changes
  useEffect(() => {
    if (discountCode) {
      validateDiscount(discountCode);
    } else {
      setDiscountValidation({ isValid: false });
    }
  }, [discountCode, validateDiscount]);

  // Utility functions
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearNotifications = useCallback(() => {
    setPriceChangeNotifications([]);
  }, []);

  const formatPrice = useCallback((amount: number): string => {
    return new Intl.NumberFormat('az-AZ', {
      style: 'currency',
      currency: 'AZN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }, []);

  return {
    // Price data
    priceBreakdown,
    isCalculating,
    error,
    
    // Price change tracking
    previousPrice,
    priceChangeNotifications,
    
    // Discount handling
    discountValidation,
    
    // Actions
    calculatePrice,
    clearError,
    clearNotifications,
    validateDiscount,
    
    // Utilities
    formatPrice,
    isValidRentalPeriod,
    minimumRentalDays,
  };
};

// Hook for price comparison between different options
export const usePriceComparison = (
  car: EnhancedCar | null,
  baseOptions: PriceCalculationOptions,
  comparisonOptions: PriceCalculationOptions[]
) => {
  const [comparisons, setComparisons] = useState<{
    basePrice: PriceBreakdown | null;
    comparisons: Array<{
      options: PriceCalculationOptions;
      price: PriceBreakdown | null;
      savings: number;
      isBetter: boolean;
    }>;
  }>({
    basePrice: null,
    comparisons: [],
  });

  const [isComparing, setIsComparing] = useState(false);

  const compareOptions = useCallback(async () => {
    if (!car) return;

    setIsComparing(true);

    try {
      const basePrice = calculateRentalPrice(car, baseOptions);
      const comparisonResults = comparisonOptions.map(options => {
        const price = calculateRentalPrice(car, options);
        const savings = basePrice.total - price.total;
        const isBetter = savings > 0;

        return {
          options,
          price,
          savings: Math.abs(savings),
          isBetter,
        };
      });

      setComparisons({
        basePrice,
        comparisons: comparisonResults,
      });
    } catch (error) {
      console.error('Price comparison failed:', error);
    } finally {
      setIsComparing(false);
    }
  }, [car, baseOptions, comparisonOptions]);

  useEffect(() => {
    if (car && baseOptions && comparisonOptions.length > 0) {
      compareOptions();
    }
  }, [car, baseOptions, comparisonOptions, compareOptions]);

  return {
    ...comparisons,
    isComparing,
    compareOptions,
  };
};

// Hook for price estimation without full calculation
export const usePriceEstimation = () => {
  const getEstimate = useCallback((
    car: EnhancedCar | null,
    days: number,
    includeServices: boolean = false
  ) => {
    if (!car || days < 1) {
      return { min: 0, max: 0, typical: 0 };
    }

    // Quick estimation logic
    let basePrice = 0;
    if (days >= 30) {
      const months = Math.floor(days / 30);
      const remainingDays = days % 30;
      basePrice = (months * car.monthlyPrice) + (remainingDays * car.dailyPrice);
    } else if (days >= 7) {
      const weeks = Math.floor(days / 7);
      const remainingDays = days % 7;
      basePrice = (weeks * car.weeklyPrice) + (remainingDays * car.dailyPrice);
    } else {
      basePrice = days * car.dailyPrice;
    }

    const min = Math.round(basePrice * 0.95); // With potential discount
    const max = Math.round(basePrice * 1.5 + (includeServices ? days * 50 : 0)); // With services and surcharges
    const typical = Math.round(basePrice * 1.2 + (includeServices ? days * 20 : 0)); // Typical scenario

    return { min, max, typical };
  }, []);

  return { getEstimate };
};

// Hook for real-time price updates with WebSocket (for future implementation)
export const useRealTimePriceUpdates = (carId: string) => {
  const [livePrice, setLivePrice] = useState<number | null>(null);
  const [priceHistory, setPriceHistory] = useState<Array<{ timestamp: Date; price: number }>>([]);

  // This would connect to a WebSocket for real-time price updates
  // For now, it's a placeholder for future implementation
  useEffect(() => {
    // WebSocket connection logic would go here
    // const ws = new WebSocket('ws://localhost:8080/price-updates');
    // ws.onmessage = (event) => {
    //   const data = JSON.parse(event.data);
    //   if (data.carId === carId) {
    //     setLivePrice(data.price);
    //     setPriceHistory(prev => [...prev, { timestamp: new Date(), price: data.price }]);
    //   }
    // };
    // return () => ws.close();
  }, [carId]);

  return {
    livePrice,
    priceHistory,
  };
};