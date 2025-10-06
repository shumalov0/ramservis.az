'use client';

import React, { useState } from 'react';
import { Heart, Share2, Calendar, Users, Fuel, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { EnhancedCar } from '@/lib/types';
import { cn } from '@/lib/utils';

interface CarHeaderProps {
  car: EnhancedCar;
  availability: boolean;
  onFavoriteToggle: () => void;
  isFavorite: boolean;
  className?: string;
}

export function CarHeader({ 
  car, 
  availability, 
  onFavoriteToggle, 
  isFavorite,
  className 
}: CarHeaderProps) {
  const [isShared, setIsShared] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${car.brand} ${car.model} ${car.year}`,
          text: `Check out this ${car.brand} ${car.model} for rent`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to copying URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      setIsShared(true);
      setTimeout(() => setIsShared(false), 2000);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
        <span>Ana səhifə</span>
        <span>/</span>
        <span>Avtomobillər</span>
        <span>/</span>
        <span className="text-foreground">{car.brand} {car.model}</span>
      </nav>

      {/* Main Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="space-y-3">
          {/* Car Title */}
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
              {car.brand} {car.model}
            </h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>{car.year}</span>
              <span>•</span>
              <span>{car.class}</span>
              <span>•</span>
              <Badge variant={availability ? "default" : "destructive"}>
                {availability ? "Mövcuddur" : "Mövcud deyil"}
              </Badge>
            </div>
          </div>

          {/* Quick Specs */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {[
              { icon: Users, text: `${car.seats} nəfər` },
              { icon: Fuel, text: car.fuelType },
              { icon: Calendar, text: car.transmission }
            ].map(({ icon: Icon, text }, index) => (
              <div key={index} className="flex items-center gap-1">
                <Icon className="h-4 w-4" />
                <span>{text}</span>
              </div>
            ))}
          </div>

          {/* Pricing */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-primary">
                ₼{car.dailyPrice}
              </span>
              <span className="text-muted-foreground">/gün</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>₼{car.weeklyPrice}/həftə</span>
              <span>₼{car.monthlyPrice}/ay</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onFavoriteToggle}
            className={cn(
              "inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
              isFavorite && "text-red-500 border-red-200 bg-red-50 hover:bg-red-100"
            )}
            aria-label={isFavorite ? "Sevimlilərden çıxar" : "Sevimliləre əlavə et"}
          >
            <Heart 
              className={cn(
                "h-4 w-4 transition-all",
                isFavorite && "fill-current"
              )} 
            />
          </button>
          
          <button
            onClick={handleShare}
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            aria-label="Paylaş"
          >
            {isShared ? (
              <Check className="h-4 w-4" />
            ) : (
              <Share2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Availability Status */}
      {availability && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="h-2 w-2 bg-green-500 rounded-full" />
          <span className="text-sm text-green-700 font-medium">
            Bu avtomobil hazırda mövcuddur və rezervasiya üçün hazırdır
          </span>
        </div>
      )}

      {!availability && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="h-2 w-2 bg-red-500 rounded-full" />
          <span className="text-sm text-red-700 font-medium">
            Bu avtomobil hazırda mövcud deyil. Digər seçimlərimizə baxın
          </span>
        </div>
      )}
    </div>
  );
}