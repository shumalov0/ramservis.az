"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Calculator,
  TrendingUp,
  TrendingDown,
  Info,
  Percent,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { EnhancedCar, BookingFormData } from "@/lib/types";
import { PriceBreakdown } from "@/lib/price-calculation";

interface PriceCalculatorProps {
  car: EnhancedCar;
  bookingData: Partial<BookingFormData>;
  onPriceUpdate: (pricing: PriceBreakdown) => void;
  isCalculating?: boolean;
  priceBreakdown?: PriceBreakdown | null;
}

interface PriceChange {
  type: "increase" | "decrease" | "same";
  amount: number;
  percentage: number;
}

export function PriceCalculator({
  car,
  bookingData,
  onPriceUpdate,
  isCalculating = false,
  priceBreakdown,
}: PriceCalculatorProps) {
  const [previousPrice, setPreviousPrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<PriceChange | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [discountApplied, setDiscountApplied] = useState<{
    code: string;
    amount: number;
    type: "percentage" | "fixed";
  } | null>(null);

  // Calculate price change when priceBreakdown updates
  useEffect(() => {
    if (priceBreakdown && previousPrice !== null) {
      const change = priceBreakdown.total - previousPrice;
      const percentage = previousPrice > 0 ? (change / previousPrice) * 100 : 0;

      setPriceChange({
        type: change > 0 ? "increase" : change < 0 ? "decrease" : "same",
        amount: Math.abs(change),
        percentage: Math.abs(percentage),
      });
    }

    if (priceBreakdown) {
      setPreviousPrice(priceBreakdown.total);
    }
  }, [priceBreakdown, previousPrice]);

  // Calculate rental days
  const getRentalDays = () => {
    if (!bookingData.pickupDate || !bookingData.dropoffDate) return 0;

    const pickup = new Date(bookingData.pickupDate);
    const dropoff = new Date(bookingData.dropoffDate);
    const timeDiff = dropoff.getTime() - pickup.getTime();
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  };

  const rentalDays = getRentalDays();

  // Get pricing tier based on rental duration
  const getPricingTier = () => {
    if (rentalDays >= 30) return "monthly";
    if (rentalDays >= 7) return "weekly";
    return "daily";
  };

  const pricingTier = getPricingTier();

  // Calculate base price without breakdown
  const calculateBasePrice = () => {
    if (rentalDays === 0) return 0;

    if (pricingTier === "monthly") {
      const months = Math.floor(rentalDays / 30);
      const remainingDays = rentalDays % 30;
      // Monthly price is per day, so multiply by 30 for total monthly cost
      const monthlyTotal = months * (car.monthlyPrice * 30);
      const dailyTotal = remainingDays * car.dailyPrice;
      return monthlyTotal + dailyTotal;
    } else if (pricingTier === "weekly") {
      const weeks = Math.floor(rentalDays / 7);
      const remainingDays = rentalDays % 7;
      // Weekly price is per day, so multiply by 7 for total weekly cost
      const weeklyTotal = weeks * (car.weeklyPrice * 7);
      const dailyTotal = remainingDays * car.dailyPrice;
      return weeklyTotal + dailyTotal;
    } else {
      return rentalDays * car.dailyPrice;
    }
  };

  const basePrice = calculateBasePrice();

  // Format currency
  const formatPrice = (amount: number) => {
    return `${amount.toFixed(0)} ₼`;
  };

  // Get savings information
  const getSavings = () => {
    if (pricingTier === "daily" || rentalDays === 0) return null;

    const dailyTotal = rentalDays * car.dailyPrice;
    const currentTotal = basePrice;
    const savings = dailyTotal - currentTotal;

    if (savings > 0) {
      return {
        amount: savings,
        percentage: (savings / dailyTotal) * 100,
      };
    }

    return null;
  };

  const savings = getSavings();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            <span>Qiymət Hesablaması</span>
          </div>
          {isCalculating && (
            <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Car Info */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
          <div className="flex-1">
            <h4 className="font-medium text-sm">
              {car.brand} {car.model}
            </h4>
            <p className="text-xs text-gray-500">
              {car.year} • {car.class}
            </p>
          </div>
          <Badge variant="outline" className="text-xs">
            {pricingTier === "monthly"
              ? "Aylıq"
              : pricingTier === "weekly"
              ? "Həftəlik"
              : "Günlük"}
          </Badge>
        </div>

        {/* Rental Period */}
        {rentalDays > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              İcarə müddəti:
            </span>
            <span className="font-medium">{rentalDays} gün</span>
          </div>
        )}

        {/* Price Breakdown or Loading */}
        {isCalculating ? (
          <div className="space-y-3" data-testid="loading-spinner">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2 mb-2"></div>
              <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
            </div>
          </div>
        ) : priceBreakdown ? (
          <div className="space-y-3">
            {/* Base Price */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Əsas qiymət:
              </span>
              <span className="font-medium">
                {formatPrice(priceBreakdown.basePrice)}
              </span>
            </div>

            {/* Location Charges */}
            {priceBreakdown.locationCharges > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Yer dəyişikliyi:
                </span>
                <span className="font-medium">
                  {formatPrice(priceBreakdown.locationCharges)}
                </span>
              </div>
            )}

            {/* Service Charges */}
            {priceBreakdown.serviceCharges > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Xidmət haqqı:
                </span>
                <span className="font-medium">
                  {formatPrice(priceBreakdown.serviceCharges)}
                </span>
              </div>
            )}

            {/* VAT - only for card payments */}
            {priceBreakdown.taxes > 0 &&
              (priceBreakdown.paymentMethod === "card" ||
                priceBreakdown.paymentMethod === "online") && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    ƏDV (18%):
                  </span>
                  <span className="font-medium">
                    {formatPrice(priceBreakdown.taxes)}
                  </span>
                </div>
              )}

            {/* Discount */}
            {discountApplied && (
              <div className="flex items-center justify-between text-sm text-green-600">
                <span className="flex items-center gap-1">
                  <Percent className="h-3 w-3" />
                  Endirim ({discountApplied.code}):
                </span>
                <span className="font-medium">
                  -{formatPrice(discountApplied.amount)}
                </span>
              </div>
            )}

            <Separator />

            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="font-semibold">Ümumi məbləğ:</span>
              <div className="text-right">
                <div className="font-bold text-lg">
                  {formatPrice(priceBreakdown.total)}
                </div>
                {priceChange && priceChange.type !== "same" && (
                  <div
                    className={`flex items-center gap-1 text-xs ${
                      priceChange.type === "increase"
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {priceChange.type === "increase" ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    <span>
                      {priceChange.type === "increase" ? "+" : "-"}
                      {formatPrice(priceChange.amount)}(
                      {priceChange.percentage.toFixed(1)}%)
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Deposit */}
            {priceBreakdown.deposit > 0 && (
              <>
                <Separator />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Depozit:
                  </span>
                  <span className="font-medium">
                    {formatPrice(priceBreakdown.deposit)}
                  </span>
                </div>
              </>
            )}
          </div>
        ) : rentalDays > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Təxmini qiymət:
              </span>
              <span className="font-medium">{formatPrice(basePrice)}</span>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Dəqiq qiymət üçün bütün məlumatları doldurun
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Qiymət hesablaması üçün tarixləri seçin
            </AlertDescription>
          </Alert>
        )}

        {/* Savings Badge */}
        {savings && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <TrendingDown className="h-4 w-4" />
              <span className="text-sm font-medium">
                {savings.percentage.toFixed(0)}% qənaət
              </span>
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              Günlük qiymətə nisbətən {formatPrice(savings.amount)} az
            </p>
          </div>
        )}

        {/* Pricing Tiers Info */}
        {rentalDays > 0 && (
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="w-full justify-between text-xs"
            >
              <span>Qiymət səviyyələri</span>
              <Info className="h-3 w-3" />
            </Button>

            {showBreakdown && (
              <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>Günlük (1-6 gün):</span>
                  <span>{formatPrice(car.dailyPrice)}/gün</span>
                </div>
                <div className="flex justify-between">
                  <span>Həftəlik (7-29 gün):</span>
                  <span>{formatPrice(car.weeklyPrice * 7)}/həftə</span>
                </div>
                <div className="flex justify-between">
                  <span>Aylıq (30+ gün):</span>
                  <span>{formatPrice(car.monthlyPrice * 30)}/ay</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Payment Method Info */}
        {bookingData.paymentMethod && (
          <div
            className={`p-3 rounded-lg border ${
              bookingData.paymentMethod === "online"
                ? "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800"
                : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
            }`}
          >
            <div
              className={`flex items-center gap-2 ${
                bookingData.paymentMethod === "online"
                  ? "text-orange-700 dark:text-orange-300"
                  : "text-blue-700 dark:text-blue-300"
              }`}
            >
              <Info className="h-4 w-4" />
              <span className="text-sm font-medium">
                {bookingData.paymentMethod === "online"
                  ? "Kartla ödəniş"
                  : "Nağd ödəniş"}
              </span>
            </div>
            <p
              className={`text-xs mt-1 ${
                bookingData.paymentMethod === "online"
                  ? "text-orange-600 dark:text-orange-400"
                  : "text-blue-600 dark:text-blue-400"
              }`}
            >
              {bookingData.paymentMethod === "online"
                ? "Kartla ödənişdə 18% ƏDV tətbiq olunur"
                : `Nağd ödəniş zamanı depozit: ${car.deposit}₼`}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
