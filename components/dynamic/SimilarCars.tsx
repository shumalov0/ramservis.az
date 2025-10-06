"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EnhancedCar } from "@/lib/types";
import { enhancedCars } from "@/lib/data";
import CarCard from "@/components/CarCard";
import { translations } from "@/lib/translations";

interface SimilarCarsProps {
  currentCar: EnhancedCar;
  maxRecommendations?: number;
  currentLang?: string;
}

export default function SimilarCars({
  currentCar,
  maxRecommendations = 8,
  currentLang = "en",
}: SimilarCarsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const t = translations[currentLang] || translations.en;

  // Localization functions
  const getLocalizedCarClass = (carClass: string) => {
    const classMap: { [key: string]: { [lang: string]: string } } = {
      Economy: { az: "Ekonom", en: "Economy", ru: "Эконом", ar: "اقتصادي" },
      Compact: { az: "Kompakt", en: "Compact", ru: "Компактный", ar: "مدمج" },
      Standard: {
        az: "Standart",
        en: "Standard",
        ru: "Стандартный",
        ar: "قياسي",
      },
      Premium: { az: "Premium", en: "Premium", ru: "Премиум", ar: "بريميوم" },
      Luxury: { az: "Lüks", en: "Luxury", ru: "Люкс", ar: "فاخر" },
      SUV: { az: "SUV", en: "SUV", ru: "Внедорожник", ar: "دفع رباعي" },
    };
    return classMap[carClass]?.[currentLang] || carClass;
  };

  const getLocalizedFuelType = (fuelType: string) => {
    const fuelMap: { [key: string]: { [lang: string]: string } } = {
      Petrol: { az: "Benzin", en: "Petrol", ru: "Бензин", ar: "بنزين" },
      Diesel: { az: "Dizel", en: "Diesel", ru: "Дизель", ar: "ديزل" },
      Electric: {
        az: "Elektrik",
        en: "Electric",
        ru: "Электрический",
        ar: "كهربائي",
      },
      Hybrid: { az: "Hibrid", en: "Hybrid", ru: "Гибрид", ar: "هجين" },
    };
    return fuelMap[fuelType]?.[currentLang] || fuelType;
  };

  const getLocalizedTransmission = (transmission: string) => {
    const transmissionMap: { [key: string]: { [lang: string]: string } } = {
      Manual: { az: "Mexaniki", en: "Manual", ru: "Механическая", ar: "يدوي" },
      Automatic: {
        az: "Avtomatik",
        en: "Automatic",
        ru: "Автоматическая",
        ar: "أوتوماتيكي",
      },
    };
    return transmissionMap[transmission]?.[currentLang] || transmission;
  };

  // Calculate similarity score based on category, price range, and features
  const similarCars = useMemo(() => {
    const candidates = enhancedCars.filter((car) => car.id !== currentCar.id);

    const scoredCars = candidates.map((car) => {
      let score = 0;

      // Category match (highest weight)
      if (car.category === currentCar.category) score += 40;

      // Price range similarity (within 30% range)
      const priceDiff = Math.abs(car.dailyPrice - currentCar.dailyPrice);
      const priceRange = currentCar.dailyPrice * 0.3;
      if (priceDiff <= priceRange) score += 25;

      // Seat count match
      if (car.seats === currentCar.seats) score += 15;

      // Fuel type match
      if (car.fuelType === currentCar.fuelType) score += 10;

      // Transmission match
      if (car.transmission === currentCar.transmission) score += 5;

      // Feature overlap
      const commonFeatures = car.features.filter((feature) =>
        currentCar.features.includes(feature)
      ).length;
      score += commonFeatures * 2;

      // Popularity boost
      score += car.popularity * 0.1;

      return { car, score };
    });

    return scoredCars
      .sort((a, b) => b.score - a.score)
      .slice(0, maxRecommendations)
      .map((item) => item.car);
  }, [currentCar, maxRecommendations]);

  const carsPerSlide = 3;
  const maxSlides = Math.max(1, Math.ceil(similarCars.length / carsPerSlide));

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % maxSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + maxSlides) % maxSlides);
  };

  if (similarCars.length === 0) {
    return null;
  }

  const startIndex = currentIndex * carsPerSlide;
  const visibleCars = similarCars.slice(startIndex, startIndex + carsPerSlide);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          {currentLang === "az"
            ? "Bənzər Maşınlar"
            : currentLang === "en"
            ? "Similar Cars You Might Like"
            : currentLang === "ru"
            ? "Похожие автомобили"
            : "سيارات مماثلة قد تعجبك"}
        </h3>

        {similarCars.length > carsPerSlide && (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={nextSlide}
              disabled={currentIndex >= maxSlides - 1}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleCars.map((car) => (
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

      {similarCars.length > carsPerSlide && (
        <div className="flex justify-center space-x-2">
          {Array.from({ length: maxSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 w-2 rounded-full transition-colors ${
                currentIndex === index
                  ? "bg-brand-gold"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
