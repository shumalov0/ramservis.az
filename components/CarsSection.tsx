// components/CarsSection.tsx
import { FC, useState, useEffect } from "react";
import { Car, enhancedCars } from "@/lib/data";
import { EnhancedCar } from "@/lib/types";
import { Translation } from "@/lib/translations";
import LoadingSpinner from "./LoadingSpinner";
import CarCard from "./CarCard";
import Link from "next/link";

interface CarsSectionProps {
  cars: Car[];
  t: Translation;
  currentLang: string;
  getLocalizedCarClass: (carClass: string) => string;
  getLocalizedFuelType: (fuelType: string) => string;
  getLocalizedTransmission: (transmission: string) => string;
  showViewAllButton?: boolean; // Ana səhifədə true, cars səhifəsində false
  showTitle?: boolean; // Başlığı göstərmək üçün
}

const CarsSection: FC<CarsSectionProps> = ({
  cars,
  t,
  currentLang,
  getLocalizedCarClass,
  getLocalizedFuelType,
  getLocalizedTransmission,
  showViewAllButton = false,
  showTitle = true,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Get most ordered cars (top 6 by popularity) - only for homepage
  const getMostOrderedCars = (): EnhancedCar[] => {
    return enhancedCars
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 6);
  };

  // Use provided cars or get most ordered cars for homepage
  const displayCars = showViewAllButton ? getMostOrderedCars() : cars;

  // Get section title based on language
  const getSectionTitle = () => {
    switch (currentLang) {
      case 'az':
        return 'Ən çox sifariş verilən maşınlar';
      case 'en':
        return 'Most Ordered Cars';
      case 'ru':
        return 'Самые заказываемые автомобили';
      case 'ar':
        return 'السيارات الأكثر طلباً';
      default:
        return 'Ən çox sifariş verilən maşınlar';
    }
  };

  // Get button text based on language
  const getButtonText = () => {
    switch (currentLang) {
      case 'az':
        return 'Digər maşınları bax';
      case 'en':
        return 'View Other Cars';
      case 'ru':
        return 'Посмотреть другие автомобили';
      case 'ar':
        return 'عرض السيارات الأخرى';
      default:
        return 'Digər maşınları bax';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Title - only show if showTitle is true */}
      {showTitle && (
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {getSectionTitle()}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#f5b754] via-yellow-400 to-[#f5b754] mx-auto rounded-full shadow-[0_0_8px_rgba(245,183,84,0.8)]"></div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {displayCars.map((car) => (
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
          
          {/* View Other Cars Button - only show if showViewAllButton is true */}
          {showViewAllButton && (
            <div className="flex justify-end mt-8">
              <Link 
                href="/cars"
                className="group inline-flex items-center gap-2 px-6 py-3 bg-[#f5b754] hover:bg-[#e6a643] text-black font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-[0_0_15px_rgba(245,183,84,0.3)] hover:shadow-[0_0_20px_rgba(245,183,84,0.5)]"
              >
                <span>{getButtonText()}</span>
                <svg 
                  className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M17 8l4 4m0 0l-4 4m4-4H3" 
                  />
                </svg>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CarsSection;
