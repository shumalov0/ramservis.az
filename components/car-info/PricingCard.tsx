'use client';

import React from 'react';
import { Calendar, CreditCard, Shield, Tag, TrendingDown, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { EnhancedCar } from '@/lib/types';
import { cn } from '@/lib/utils';

interface PricingCardProps {
  car: EnhancedCar;
  selectedDuration?: 'daily' | 'weekly' | 'monthly';
  onDurationChange?: (duration: 'daily' | 'weekly' | 'monthly') => void;
  onBookNow?: () => void;
  promotionalOffers?: {
    title: string;
    discount: number;
    validUntil: string;
    description: string;
  }[];
  className?: string;
}

export function PricingCard({ 
  car, 
  selectedDuration = 'daily',
  onDurationChange,
  onBookNow,
  promotionalOffers = [],
  className 
}: PricingCardProps) {
  const getPriceByDuration = (duration: 'daily' | 'weekly' | 'monthly') => {
    switch (duration) {
      case 'weekly':
        return car.weeklyPrice;
      case 'monthly':
        return car.monthlyPrice;
      default:
        return car.dailyPrice;
    }
  };

  const getDurationLabel = (duration: 'daily' | 'weekly' | 'monthly') => {
    switch (duration) {
      case 'weekly':
        return 'həftə';
      case 'monthly':
        return 'ay';
      default:
        return 'gün';
    }
  };

  const calculateSavings = (duration: 'weekly' | 'monthly') => {
    const dailyEquivalent = duration === 'weekly' 
      ? car.dailyPrice * 7 
      : car.dailyPrice * 30;
    const actualPrice = duration === 'weekly'
      ? car.weeklyPrice * 7  // Weekly price is per day, so multiply by 7
      : car.monthlyPrice * 30; // Monthly price is per day, so multiply by 30
    return dailyEquivalent - actualPrice;
  };

  const currentPrice = getPriceByDuration(selectedDuration);
  const hasPromotions = promotionalOffers.length > 0;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Promotional Offers */}
      {hasPromotions && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Tag className="h-5 w-5" />
              Xüsusi Təkliflər
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {promotionalOffers.map((offer, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200">
                <div className="space-y-1">
                  <h4 className="font-medium text-orange-900">{offer.title}</h4>
                  <p className="text-sm text-orange-700">{offer.description}</p>
                  <div className="flex items-center gap-1 text-xs text-orange-600">
                    <Clock className="h-3 w-3" />
                    <span>{offer.validUntil} tarixinə qədər</span>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  {offer.discount}% endirim
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Main Pricing Card */}
      <Card className="sticky top-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Qiymət Məlumatları
          </CardTitle>
          <CardDescription>
            Müxtəlif müddətlər üçün icarə qiymətləri
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Duration Selection */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Müddət seçin:</h4>
            <div className="grid grid-cols-3 gap-2">
              {(['daily', 'weekly', 'monthly'] as const).map((duration) => {
                const price = getPriceByDuration(duration);
                const savings = duration !== 'daily' ? calculateSavings(duration) : 0;
                
                return (
                  <button
                    key={duration}
                    onClick={() => onDurationChange?.(duration)}
                    className={cn(
                      "p-3 text-center border rounded-lg transition-all hover:border-primary",
                      selectedDuration === duration 
                        ? "border-primary bg-primary/5 text-primary" 
                        : "border-border"
                    )}
                  >
                    <div className="space-y-1">
                      <div className="font-bold text-lg">₼{price}</div>
                      <div className="text-xs text-muted-foreground">
                        /{getDurationLabel(duration)}
                      </div>
                      {savings > 0 && (
                        <div className="text-xs text-green-600 font-medium">
                          ₼{savings} qənaət
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Price Breakdown */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {selectedDuration === 'daily' ? 'Günlük' : 
                 selectedDuration === 'weekly' ? 'Həftəlik' : 'Aylıq'} qiymət
              </span>
              <span className="font-bold text-2xl">₼{currentPrice}</span>
            </div>

            {selectedDuration !== 'daily' && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {selectedDuration === 'weekly' ? 'Həftəlik toplam' : 'Aylıq toplam'}
                </span>
                <span className="font-medium">
                  ₼{selectedDuration === 'weekly' ? currentPrice * 7 : currentPrice * 30}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Depozit</span>
              <span className="font-medium text-orange-600">₼{car.deposit}</span>
            </div>

            {selectedDuration !== 'daily' && calculateSavings(selectedDuration as 'weekly' | 'monthly') > 0 && (
              <div className="flex items-center justify-between text-sm p-2 bg-green-50 rounded-lg">
                <div className="flex items-center gap-1 text-green-700">
                  <TrendingDown className="h-4 w-4" />
                  <span>Qənaət</span>
                </div>
                <span className="font-medium text-green-700">
                  ₼{calculateSavings(selectedDuration as 'weekly' | 'monthly')}
                </span>
              </div>
            )}
          </div>

          <Separator />

          {/* Additional Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>Tam sığorta daxildir</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Pulsuz ləğvetmə (24 saat əvvəl)</span>
            </div>
          </div>

          {/* Book Now Button */}
          <Button 
            onClick={onBookNow}
            className="w-full h-12 text-lg font-semibold"
            size="lg"
          >
            İndi Rezervasiya Et
          </Button>

          {/* Contact Information */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Sualınız var? Bizimlə əlaqə saxlayın
            </p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <a 
                href="tel:+994123456789" 
                className="text-primary hover:underline font-medium"
              >
                +994 12 345 67 89
              </a>
              <span className="text-muted-foreground">və ya</span>
              <a 
                href="https://wa.me/994123456789" 
                className="text-green-600 hover:underline font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}