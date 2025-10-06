'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Calculator, 
  TrendingUp, 
  TrendingDown, 
  Info, 
  Tag, 
  Calendar,
  MapPin,
  Plus,
  Minus,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { PriceBreakdown, PriceChangeNotification } from '@/lib/price-calculation';
import { usePriceCalculation } from '@/hooks/use-price-calculation';
import { EnhancedCar } from '@/lib/types';

interface PriceDisplayProps {
  car: EnhancedCar | null;
  carId?: string;
  pickupDate?: string;
  dropoffDate?: string;
  pickupLocation?: string;
  dropoffLocation?: string;
  additionalServices?: string[];
  discountCode?: string;
  onPriceChange?: (priceBreakdown: PriceBreakdown | null) => void;
  onDiscountApplied?: (discount: any) => void;
  showDetailedBreakdown?: boolean;
  showDiscountInput?: boolean;
  showPriceHistory?: boolean;
  className?: string;
}

export default function PriceDisplay({
  car,
  carId,
  pickupDate,
  dropoffDate,
  pickupLocation,
  dropoffLocation,
  additionalServices = [],
  discountCode: initialDiscountCode,
  onPriceChange,
  onDiscountApplied,
  showDetailedBreakdown = true,
  showDiscountInput = true,
  showPriceHistory = false,
  className = '',
}: PriceDisplayProps) {
  const [discountCode, setDiscountCode] = useState(initialDiscountCode || '');
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [priceHistory, setPriceHistory] = useState<Array<{ timestamp: Date; price: number }>>([]);

  const {
    priceBreakdown,
    isCalculating,
    error,
    previousPrice,
    priceChangeNotifications,
    discountValidation,
    calculatePrice,
    clearError,
    clearNotifications,
    validateDiscount,
    formatPrice,
    isValidRentalPeriod,
  } = usePriceCalculation({
    carId: carId || car?.id,
    pickupDate,
    dropoffDate,
    pickupLocation,
    dropoffLocation,
    additionalServices,
    discountCode,
    autoCalculate: true,
  });

  // Track price changes for history
  useEffect(() => {
    if (priceBreakdown && previousPrice && priceBreakdown.total !== previousPrice.total) {
      setPriceHistory(prev => [
        ...prev.slice(-9), // Keep last 10 entries
        { timestamp: new Date(), price: priceBreakdown.total }
      ]);
    }
  }, [priceBreakdown, previousPrice]);

  // Notify parent component of price changes
  useEffect(() => {
    if (onPriceChange) {
      onPriceChange(priceBreakdown);
    }
  }, [priceBreakdown, onPriceChange]);

  // Handle discount code changes
  const handleDiscountCodeChange = (code: string) => {
    setDiscountCode(code);
    if (code) {
      validateDiscount(code);
    }
  };

  const applyDiscount = () => {
    if (discountValidation.isValid && onDiscountApplied) {
      onDiscountApplied(discountValidation.discount);
    }
    calculatePrice({ discountCode });
  };

  const removeDiscount = () => {
    setDiscountCode('');
    calculatePrice({ discountCode: undefined });
  };

  // Format notification icon
  const getNotificationIcon = (type: PriceChangeNotification['type']) => {
    switch (type) {
      case 'increase':
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'decrease':
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  // Format price change amount
  const formatPriceChange = (amount: number, type: PriceChangeNotification['type']) => {
    const prefix = type === 'increase' ? '+' : type === 'decrease' ? '-' : '';
    return `${prefix}${formatPrice(amount)}`;
  };

  if (!car && !carId) {
    return (
      <Card className={`bg-white dark:bg-[#1a1a1a] ${className}`}>
        <CardContent className="p-6">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Select a car to see pricing</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-white dark:bg-[#1a1a1a] shadow-lg ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Price Summary
          </span>
          {isCalculating && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4 animate-spin" />
              Calculating...
            </div>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearError}
                className="ml-2 h-auto p-0 text-xs underline"
              >
                Dismiss
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Price Change Notifications */}
        {priceChangeNotifications.length > 0 && (
          <div className="space-y-2">
            {priceChangeNotifications.map((notification, index) => (
              <Alert key={index} className="py-2">
                {getNotificationIcon(notification.type)}
                <AlertDescription className="flex items-center justify-between">
                  <span>{notification.message}</span>
                  {notification.amount && (
                    <Badge variant={notification.type === 'decrease' ? 'default' : 'secondary'}>
                      {formatPriceChange(notification.amount, notification.type)}
                    </Badge>
                  )}
                </AlertDescription>
              </Alert>
            ))}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearNotifications}
              className="text-xs"
            >
              Clear notifications
            </Button>
          </div>
        )}

        {/* Discount Code Input */}
        {showDiscountInput && (
          <div className="space-y-3">
            <Label htmlFor="discount-code" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Discount Code
            </Label>
            <div className="flex gap-2">
              <Input
                id="discount-code"
                value={discountCode}
                onChange={(e) => handleDiscountCodeChange(e.target.value)}
                placeholder="Enter discount code"
                className="flex-1"
              />
              {discountCode && (
                <Button
                  variant={discountValidation.isValid ? "default" : "secondary"}
                  size="sm"
                  onClick={discountValidation.isValid ? applyDiscount : () => validateDiscount(discountCode)}
                  disabled={isCalculating}
                >
                  {discountValidation.isValid ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Tag className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
            {discountCode && discountValidation.error && (
              <p className="text-sm text-red-500">{discountValidation.error}</p>
            )}
            {discountCode && discountValidation.isValid && discountValidation.discount && (
              <div className="flex items-center justify-between text-sm text-green-600">
                <span>✓ {discountValidation.discount.description}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeDiscount}
                  className="h-auto p-0 text-xs underline"
                >
                  Remove
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Main Price Display */}
        {priceBreakdown && isValidRentalPeriod ? (
          <div className="space-y-4">
            {/* Quick Summary */}
            <div className="bg-gray-50 dark:bg-[#1a1a1a] rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  {priceBreakdown.days} day{priceBreakdown.days !== 1 ? 's' : ''}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBreakdown(!showBreakdown)}
                  className="text-xs"
                >
                  {showBreakdown ? <Minus className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                  {showBreakdown ? 'Hide' : 'Show'} breakdown
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(priceBreakdown.total)}
                </span>
                <div className="text-right">
                  <div className="text-sm text-gray-500">
                    {formatPrice(priceBreakdown.total / priceBreakdown.days)}/day
                  </div>
                  <div className="text-xs text-red-600 dark:text-red-400">
                    + {formatPrice(priceBreakdown.deposit)} deposit
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Breakdown */}
            {showBreakdown && showDetailedBreakdown && (
              <div className="space-y-3">
                <Separator />
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Base rental</span>
                    <span className="font-medium">{formatPrice(priceBreakdown.basePrice)}</span>
                  </div>
                  
                  {priceBreakdown.locationCharges > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        Location charges
                      </span>
                      <span className="font-medium">{formatPrice(priceBreakdown.locationCharges)}</span>
                    </div>
                  )}
                  
                  {priceBreakdown.serviceCharges > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Additional services</span>
                      <span className="font-medium">{formatPrice(priceBreakdown.serviceCharges)}</span>
                    </div>
                  )}
                  
                  {priceBreakdown.weekendSurcharge > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Weekend surcharge</span>
                      <span className="font-medium text-orange-600">{formatPrice(priceBreakdown.weekendSurcharge)}</span>
                    </div>
                  )}
                  
                  {priceBreakdown.holidaySurcharge > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Holiday surcharge</span>
                      <span className="font-medium text-orange-600">{formatPrice(priceBreakdown.holidaySurcharge)}</span>
                    </div>
                  )}
                  
                  {priceBreakdown.discounts > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Discounts</span>
                      <span className="font-medium text-green-600">-{formatPrice(priceBreakdown.discounts)}</span>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                    <span className="font-medium">{formatPrice(priceBreakdown.subtotal - priceBreakdown.discounts)}</span>
                  </div>
                  
                  {priceBreakdown.taxes > 0 && priceBreakdown.paymentMethod === 'card' && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">VAT (18%)</span>
                      <span className="font-medium">{formatPrice(priceBreakdown.taxes)}</span>
                    </div>
                  )}

                  {priceBreakdown.cardCommission > 0 && priceBreakdown.paymentMethod === 'card' && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Card Commission (18%)</span>
                      <span className="font-medium text-orange-600">{formatPrice(priceBreakdown.cardCommission)}</span>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-blue-600 dark:text-blue-400">{formatPrice(priceBreakdown.total)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Price History */}
            {showPriceHistory && priceHistory.length > 0 && (
              <div className="space-y-2">
                <Separator />
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Price History</h4>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {priceHistory.slice(-5).map((entry, index) => (
                    <div key={index} className="flex justify-between text-xs text-gray-500">
                      <span>{entry.timestamp.toLocaleTimeString()}</span>
                      <span>{formatPrice(entry.price)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          !error && (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                {!isValidRentalPeriod 
                  ? 'Please select valid pickup and dropoff dates'
                  : 'Enter rental details to see pricing'
                }
              </p>
            </div>
          )
        )}

        {/* Action Buttons */}
        {priceBreakdown && (
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => calculatePrice()}
              disabled={isCalculating}
              className="flex-1"
            >
              <Calculator className="h-4 w-4 mr-2" />
              Recalculate
            </Button>
            {showDetailedBreakdown && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBreakdown(!showBreakdown)}
              >
                {showBreakdown ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}