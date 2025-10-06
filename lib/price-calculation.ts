import { EnhancedCar } from "./types";
import { locations, additionalServices } from "./data";

// Price calculation interfaces
export interface PriceBreakdown {
  days: number;
  basePrice: number;
  locationCharges: number;
  serviceCharges: number;
  weekendSurcharge: number;
  holidaySurcharge: number;
  discounts: number;
  subtotal: number;
  taxes: number;
  cardCommission: number;
  total: number;
  deposit: number;
  paymentMethod?: "cash" | "card" | "online";
}

export interface PriceCalculationOptions {
  carId: string;
  pickupDate: string;
  dropoffDate: string;
  pickupLocation: string;
  dropoffLocation: string;
  additionalServices: string[];
  discountCode?: string;
  paymentMethod?: "cash" | "card" | "online";
}

// Holiday dates for Azerbaijan (simplified - in production, use a proper holiday API)
const AZERBAIJAN_HOLIDAYS = [
  "01-01", // New Year
  "01-02", // New Year
  "03-08", // Women's Day
  "03-20", // Novruz Bayram
  "03-21", // Novruz Bayram
  "03-22", // Novruz Bayram
  "03-23", // Novruz Bayram
  "03-24", // Novruz Bayram
  "05-09", // Victory Day
  "05-28", // Republic Day
  "06-15", // National Salvation Day
  "06-26", // Armed Forces Day
  "10-18", // Independence Day
  "11-09", // Flag Day
  "11-17", // National Revival Day
  "12-31", // Solidarity Day
];

// Discount codes and their values
const DISCOUNT_CODES: Record<
  string,
  { percentage: number; maxAmount: number; description: string }
> = {
  WELCOME10: {
    percentage: 10,
    maxAmount: 85,
    description: "Xoş gəldin endirimi 10%",
  },
  LONGTERM15: {
    percentage: 15,
    maxAmount: 340,
    description: "Uzunmüddətli icarə 15%",
  },
  REPEAT20: {
    percentage: 20,
    maxAmount: 170,
    description: "Daimi müştəri 20%",
  },
  STUDENT5: { percentage: 5, maxAmount: 43, description: "Tələbə endirimi 5%" },
};

// Utility functions
const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday or Saturday
};

const isHoliday = (date: Date): boolean => {
  const monthDay = `${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
  return AZERBAIJAN_HOLIDAYS.includes(monthDay);
};

const calculateDaysBetween = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDiff = end.getTime() - start.getTime();
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
};

const getWeekendDays = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  let weekendDays = 0;

  const current = new Date(start);
  while (current <= end) {
    if (isWeekend(current)) {
      weekendDays++;
    }
    current.setDate(current.getDate() + 1);
  }

  return weekendDays;
};

const getHolidayDays = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  let holidayDays = 0;

  const current = new Date(start);
  while (current <= end) {
    if (isHoliday(current)) {
      holidayDays++;
    }
    current.setDate(current.getDate() + 1);
  }

  return holidayDays;
};

// Main price calculation function
export const calculateRentalPrice = (
  car: EnhancedCar,
  options: PriceCalculationOptions
): PriceBreakdown => {
  const {
    pickupDate,
    dropoffDate,
    pickupLocation,
    dropoffLocation,
    additionalServices: selectedServices,
    discountCode,
    paymentMethod = "cash",
  } = options;

  // Debug log
  console.log("Price calculation - paymentMethod:", paymentMethod);

  // Calculate rental period
  const days = calculateDaysBetween(pickupDate, dropoffDate);

  if (days < 1) {
    throw new Error("Invalid rental period: must be at least 1 day");
  }

  // Calculate base price with tiered pricing
  let basePrice = 0;

  if (days >= 30) {
    // Monthly pricing (most economical) - calculate total monthly cost
    const months = Math.floor(days / 30);
    const remainingDays = days % 30;

    // Monthly price is per month, so multiply by 30 to get total for the month
    const monthlyTotal = months * (car.monthlyPrice * 30);

    if (remainingDays >= 7) {
      const weeks = Math.floor(remainingDays / 7);
      const finalDays = remainingDays % 7;
      // Weekly price is per day for weekly rental, so multiply by 7
      const weeklyTotal = weeks * (car.weeklyPrice * 7);
      const dailyTotal = finalDays * car.dailyPrice;
      basePrice = monthlyTotal + weeklyTotal + dailyTotal;
    } else {
      const dailyTotal = remainingDays * car.dailyPrice;
      basePrice = monthlyTotal + dailyTotal;
    }
  } else if (days >= 7) {
    // Weekly pricing - weekly price is per day for weekly rental
    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;
    const weeklyTotal = weeks * (car.weeklyPrice * 7);
    const dailyTotal = remainingDays * car.dailyPrice;
    basePrice = weeklyTotal + dailyTotal;
  } else {
    // Daily pricing
    basePrice = days * car.dailyPrice;
  }

  // Calculate location charges
  const pickupLocationData = locations.find((l) => l.id === pickupLocation);
  const dropoffLocationData = locations.find((l) => l.id === dropoffLocation);
  const locationCharges =
    (pickupLocationData?.extraCharge || 0) +
    (dropoffLocationData?.extraCharge || 0);

  // Calculate additional service charges
  const serviceCharges = selectedServices.reduce((total, serviceId) => {
    const service = additionalServices.find((s) => s.id === serviceId);
    return total + (service ? service.price * days : 0);
  }, 0);

  // Calculate weekend surcharge (disabled for now)
  const weekendDays = getWeekendDays(pickupDate, dropoffDate);
  const weekendSurcharge = 0; // Disabled: weekendDays * car.dailyPrice * 0.1;

  // Calculate holiday surcharge (disabled for now)
  const holidayDays = getHolidayDays(pickupDate, dropoffDate);
  const holidaySurcharge = 0; // Disabled: holidayDays * car.dailyPrice * 0.15;

  // Calculate subtotal before discounts
  const subtotal =
    basePrice +
    locationCharges +
    serviceCharges +
    weekendSurcharge +
    holidaySurcharge;

  // Apply discount if valid
  let discounts = 0;
  if (discountCode && DISCOUNT_CODES[discountCode.toUpperCase()]) {
    const discount = DISCOUNT_CODES[discountCode.toUpperCase()];
    const discountAmount = Math.min(
      (subtotal * discount.percentage) / 100,
      discount.maxAmount
    );
    discounts = discountAmount;
  }

  // Apply automatic long-term discount (5% for 30+ days, 10% for 60+ days)
  if (days >= 60) {
    const longTermDiscount = subtotal * 0.1;
    discounts = Math.max(discounts, longTermDiscount);
  } else if (days >= 30) {
    const longTermDiscount = subtotal * 0.05;
    discounts = Math.max(discounts, longTermDiscount);
  }

  // Calculate taxes (18% VAT only for card payments)
  const taxableAmount = subtotal - discounts;
  const taxes =
    paymentMethod === "card" || paymentMethod === "online"
      ? taxableAmount * 0.18
      : 0;

  // No card commission - removed as per requirement
  const cardCommission = 0;

  // Debug logs
  console.log("Tax calculation - paymentMethod:", paymentMethod);
  console.log("Tax calculation - taxableAmount:", taxableAmount);
  console.log("Tax calculation - taxes:", taxes);
  console.log("Tax calculation - cardCommission:", cardCommission);

  // Calculate final total (no card commission)
  const total = taxableAmount + taxes;

  // Deposit calculation - use fixed deposit amount from car data, never change it
  const deposit = car.deposit;

  return {
    days,
    basePrice,
    locationCharges,
    serviceCharges,
    weekendSurcharge,
    holidaySurcharge,
    discounts,
    subtotal,
    taxes,
    cardCommission,
    total: Math.round(total * 100) / 100, // Round to 2 decimal places
    deposit: Math.round(deposit * 100) / 100,
    paymentMethod,
  };
};

// Real-time price calculation hook for React components
export const useRealTimePricing = () => {
  const calculatePrice = (
    car: EnhancedCar | null,
    options: Partial<PriceCalculationOptions>
  ): PriceBreakdown | null => {
    if (!car || !options.pickupDate || !options.dropoffDate) {
      return null;
    }

    try {
      const fullOptions: PriceCalculationOptions = {
        ...options,
        carId: car.id,
        pickupLocation: options.pickupLocation || "office",
        dropoffLocation: options.dropoffLocation || "office",
        additionalServices: options.additionalServices || [],
        pickupDate: options.pickupDate || "",
        dropoffDate: options.dropoffDate || "",
        paymentMethod: options.paymentMethod || "cash",
      };

      return calculateRentalPrice(car, fullOptions);
    } catch (error) {
      console.error("Price calculation error:", error);
      return null;
    }
  };

  return { calculatePrice };
};

// Price formatting utilities
export const formatPrice = (
  amount: number,
  currency: string = "AZN"
): string => {
  return `${amount.toFixed(0)} ₼`;
};

export const formatPriceAZ = (amount: number): string => {
  return `${amount.toFixed(0)} ₼`;
};

// Price comparison utilities
export const comparePrices = (
  car: EnhancedCar,
  options1: PriceCalculationOptions,
  options2: PriceCalculationOptions
): {
  price1: PriceBreakdown;
  price2: PriceBreakdown;
  savings: number;
  betterOption: 1 | 2 | "equal";
} => {
  const price1 = calculateRentalPrice(car, options1);
  const price2 = calculateRentalPrice(car, options2);
  const savings = Math.abs(price1.total - price2.total);

  let betterOption: 1 | 2 | "equal" = "equal";
  if (price1.total < price2.total) {
    betterOption = 1;
  } else if (price2.total < price1.total) {
    betterOption = 2;
  }

  return { price1, price2, savings, betterOption };
};

// Discount validation
export const validateDiscountCode = (
  code: string
): {
  isValid: boolean;
  discount?: (typeof DISCOUNT_CODES)[string];
  error?: string;
} => {
  if (!code) {
    return { isValid: false, error: "Discount code is required" };
  }

  const upperCode = code.toUpperCase();
  const discount = DISCOUNT_CODES[upperCode];

  if (!discount) {
    return { isValid: false, error: "Invalid discount code" };
  }

  return { isValid: true, discount };
};

// Price estimation for quick quotes
export const getQuickPriceEstimate = (
  car: EnhancedCar,
  days: number,
  includeServices: boolean = false
): { min: number; max: number; typical: number } => {
  // Base price calculation
  let basePrice = 0;
  if (days >= 30) {
    const months = Math.floor(days / 30);
    const remainingDays = days % 30;
    // Monthly price is per month, so multiply by 30 to get total for the month
    const monthlyTotal = months * (car.monthlyPrice * 30);
    const dailyTotal = remainingDays * car.dailyPrice;
    basePrice = monthlyTotal + dailyTotal;
  } else if (days >= 7) {
    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;
    // Weekly price is per day for weekly rental, so multiply by 7
    const weeklyTotal = weeks * (car.weeklyPrice * 7);
    const dailyTotal = remainingDays * car.dailyPrice;
    basePrice = weeklyTotal + dailyTotal;
  } else {
    basePrice = days * car.dailyPrice;
  }

  // Minimum price (office pickup/dropoff, no services, with long-term discount)
  let min = basePrice;
  if (days >= 30) {
    min *= 0.95; // 5% long-term discount
  }

  // Maximum price (airport pickup/dropoff, all services, weekend/holiday surcharge)
  let max = basePrice;
  max += 85; // Location charges
  if (includeServices) {
    max += days * 159; // All services combined (85+17+14+43)
  }
  max += basePrice * 0.25; // Potential weekend/holiday surcharge
  max *= 1.18; // VAT

  // Typical price (city center pickup/dropoff, some services)
  let typical = basePrice;
  typical += 51; // Typical location charges
  if (includeServices) {
    typical += days * 60; // Some services
  }
  typical *= 1.18; // VAT

  return {
    min: Math.round(min),
    max: Math.round(max),
    typical: Math.round(typical),
  };
};

// Export discount codes for UI display
export const getAvailableDiscountCodes = () => DISCOUNT_CODES;

// Price change notifications
export interface PriceChangeNotification {
  type: "increase" | "decrease" | "info";
  message: string;
  amount?: number;
}

export const getPriceChangeNotifications = (
  oldPrice: PriceBreakdown | null,
  newPrice: PriceBreakdown
): PriceChangeNotification[] => {
  const notifications: PriceChangeNotification[] = [];

  if (oldPrice && oldPrice.total !== newPrice.total) {
    const difference = newPrice.total - oldPrice.total;
    notifications.push({
      type: difference > 0 ? "increase" : "decrease",
      message:
        difference > 0
          ? `Price increased by ${formatPriceAZ(Math.abs(difference))}`
          : `Price decreased by ${formatPriceAZ(Math.abs(difference))}`,
      amount: Math.abs(difference),
    });
  }

  if (newPrice.weekendSurcharge > 0) {
    notifications.push({
      type: "info",
      message: `Weekend surcharge applied: ${formatPriceAZ(
        newPrice.weekendSurcharge
      )}`,
      amount: newPrice.weekendSurcharge,
    });
  }

  if (newPrice.holidaySurcharge > 0) {
    notifications.push({
      type: "info",
      message: `Holiday surcharge applied: ${formatPriceAZ(
        newPrice.holidaySurcharge
      )}`,
      amount: newPrice.holidaySurcharge,
    });
  }

  if (newPrice.discounts > 0) {
    notifications.push({
      type: "decrease",
      message: `Discount applied: ${formatPriceAZ(newPrice.discounts)}`,
      amount: newPrice.discounts,
    });
  }

  return notifications;
};
