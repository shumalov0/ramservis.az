"use client";

import { FC, useState, useEffect, memo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EnhancedCar } from "@/lib/types";
import { Translation } from "@/lib/translations";
import LoadingSpinner from "./LoadingSpinner";
import CarsCarousel from "./CarsCarousel";

interface OtherCarsSectionProps {
  cars: EnhancedCar[];
  excludeIds?: string[];
  maxCars?: number;
  category?: string;
  currentLang: string;
  t: Translation;
  getLocalizedCarClass: (carClass: string) => string;
  getLocalizedFuelType: (fuelType: string) => string;
  getLocalizedTransmission: (transmission: string) => string;
}

const OtherCarsSection: FC<OtherCarsSectionProps> = memo(function OtherCarsSection({
  cars,
  excludeIds = [],
  maxCars = 6,
  category,
  currentLang,
  t,
  getLocalizedCarClass,
  getLocalizedFuelType,
  getLocalizedTransmission,
}) {
  const [isLoading, setIsLoading] = useState(true);

  // Filter cars based on excludeIds and category
  const filteredCars = cars
    .filter(car => !excludeIds.includes(car.id))
    .filter(car => !category || car.category.toLowerCase() === category.toLowerCase())
    .slice(0, maxCars);

  // Don't render if no cars to show
  if (filteredCars.length === 0) {
    return null;
  }

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-16 bg-gray-50/50 dark:bg-brand-dark/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {currentLang === 'az' ? 'Digər Maşınlar' : 
             currentLang === 'en' ? 'Other Cars' :
             currentLang === 'ru' ? 'Другие автомобили' : 'سيارات أخرى'}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {currentLang === 'az' ? 'Daha çox seçim üçün digər mövcud maşınlarımıza baxın' :
             currentLang === 'en' ? 'Explore more of our available vehicles for additional options' :
             currentLang === 'ru' ? 'Изучите больше наших доступных автомобилей для дополнительных вариантов' : 'استكشف المزيد من مركباتنا المتاحة للحصول على خيارات إضافية'}
          </p>
        </div>

        {/* Cars Carousel */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <CarsCarousel
            cars={filteredCars}
            currentLang={currentLang}
            t={t}
            getLocalizedCarClass={getLocalizedCarClass}
            getLocalizedFuelType={getLocalizedFuelType}
            getLocalizedTransmission={getLocalizedTransmission}
            autoPlay={true}
            autoPlayInterval={4000}
            itemsPerView={{
              mobile: 1,
              tablet: 2,
              desktop: 3
            }}
          />
        )}



        {/* View All Cars Link */}
        <div className="text-center mt-8">
          <Link href={`/cars?lang=${currentLang}`}>
            <Button
              variant="outline"
              size="lg"
              className="border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-white px-8 py-3"
            >
              {currentLang === 'az' ? 'Bütün Maşınları Gör' : 
               currentLang === 'en' ? 'View All Cars' :
               currentLang === 'ru' ? 'Посмотреть все автомобили' : 'عرض جميع السيارات'}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
});

export default OtherCarsSection;