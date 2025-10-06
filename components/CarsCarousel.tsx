"use client";

import { FC, useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedCar } from "@/lib/types";
import { Translation } from "@/lib/translations";
import CarCard from "./CarCard";

interface CarsCarouselProps {
  cars: EnhancedCar[];
  currentLang: string;
  t: Translation;
  getLocalizedCarClass: (carClass: string) => string;
  getLocalizedFuelType: (fuelType: string) => string;
  getLocalizedTransmission: (transmission: string) => string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  itemsPerView?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

const CarsCarousel: FC<CarsCarouselProps> = ({
  cars,
  currentLang,
  t,
  getLocalizedCarClass,
  getLocalizedFuelType,
  getLocalizedTransmission,
  autoPlay = true,
  autoPlayInterval = 4000,
  itemsPerView = { mobile: 1, tablet: 2, desktop: 3 },
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [currentItemsPerView, setCurrentItemsPerView] = useState(itemsPerView.desktop);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Handle responsive items per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCurrentItemsPerView(itemsPerView.mobile);
      } else if (window.innerWidth < 1024) {
        setCurrentItemsPerView(itemsPerView.tablet);
      } else {
        setCurrentItemsPerView(itemsPerView.desktop);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [itemsPerView]);

  // Reset current index when items per view changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [currentItemsPerView]);

  const totalSlides = Math.ceil(cars.length / currentItemsPerView);

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && !isHovered && totalSlides > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % totalSlides);
      }, autoPlayInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoPlay, isHovered, totalSlides, autoPlayInterval]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && totalSlides > 1) {
      goToNext();
    }
    if (isRightSwipe && totalSlides > 1) {
      goToPrevious();
    }
  };

  const getCurrentSliceCars = () => {
    const startIndex = currentIndex * currentItemsPerView;
    return cars.slice(startIndex, startIndex + currentItemsPerView);
  };

  if (cars.length === 0) return null;

  // If we have fewer cars than items per view, show them in a simple grid
  if (cars.length <= currentItemsPerView) {
    return (
      <div className={`grid gap-6 px-4 ${
        currentItemsPerView === 1 
          ? 'grid-cols-1' 
          : currentItemsPerView === 2 
          ? 'grid-cols-1 md:grid-cols-2' 
          : currentItemsPerView === 3
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          : currentItemsPerView === 5
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
          : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      }`}>
        {cars.map((car) => (
          <CarCard
            key={car.id}
            car={car}
            currentLang={currentLang}
            t={t}
            getLocalizedCarClass={getLocalizedCarClass}
            getLocalizedFuelType={getLocalizedFuelType}
            getLocalizedTransmission={getLocalizedTransmission}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Carousel Container */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {Array.from({ length: totalSlides }).map((_, slideIndex) => {
            const startIndex = slideIndex * currentItemsPerView;
            const slideCars = cars.slice(startIndex, startIndex + currentItemsPerView);
            
            return (
              <div
                key={slideIndex}
                className="w-full flex-shrink-0"
              >
                <div className={`grid gap-6 px-4 ${
                  currentItemsPerView === 1 
                    ? 'grid-cols-1' 
                    : currentItemsPerView === 2 
                    ? 'grid-cols-1 md:grid-cols-2' 
                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                }`}>
                  {slideCars.map((car) => (
                    <CarCard
                      key={car.id}
                      car={car}
                      currentLang={currentLang}
                      t={t}
                      getLocalizedCarClass={getLocalizedCarClass}
                      getLocalizedFuelType={getLocalizedFuelType}
                      getLocalizedTransmission={getLocalizedTransmission}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Arrows - Hidden on mobile, visible on tablet and desktop */}
      {totalSlides > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/95 hover:bg-white border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-105 hidden md:flex"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/95 hover:bg-white border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-105 hidden md:flex"
            onClick={goToNext}
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </Button>
        </>
      )}

      {/* Dots Indicator */}
      {totalSlides > 1 && (
        <div className="flex justify-center mt-8 space-x-3">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
                index === currentIndex
                  ? "bg-brand-gold shadow-lg scale-110"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CarsCarousel;