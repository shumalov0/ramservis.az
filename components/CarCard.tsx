"use client";
import { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import type { Car, EnhancedCar } from "@/lib/types";
import { Translation } from "@/lib/translations";
import { useFavorites } from "@/hooks/use-favorites";

interface CarCardProps {
  car: Car | EnhancedCar;
  currentLang: string;
  t: Translation;
  getLocalizedCarClass: (carClass: string) => string;
  getLocalizedFuelType: (fuelType: string) => string;
  getLocalizedTransmission: (transmission: string) => string;
}

const CarCard: FC<CarCardProps> = ({
  car,
  currentLang,
  t,
  getLocalizedCarClass,
  getLocalizedFuelType,
  getLocalizedTransmission,
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();

  const getCarImage = () => {
    if ("gallery" in car && car.gallery?.length) {
      return car.gallery[0];
    }
    if ("images" in car && car.images?.length) {
      return car.images[0];
    }
    return car.image;
  };
  // Get car category from enhanced data
  const getCarCategory = () => {
    if ("category" in car && car.category) {
      return Array.isArray(car.category) ? car.category[0] : car.category;
    }
    return car.class;
  };

  return (
    <Link
      href={`/car/${car.id}?lang=${currentLang}`}
      prefetch={true}
      className="block"
    >
      <Card className="rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-slate-700 w-full cursor-pointer hover:shadow-xl transition-shadow duration-300">
        {/* Şəkil hissəsi */}
        <div className="aspect-[4/3] relative overflow-hidden imageParent w-full">
          <Image
            src={getCarImage()}
            alt={`${car.brand} ${car.model}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
            loading="lazy"
            quality={75}
          />
          {/* Badge */}
          <div className="absolute top-4 right-4">
            <Badge
              variant="secondary"
              className="bg-white text-[#dbbc42] px-[12px] py-[3px] rounded-[4px] text-[12px]"
            >
              {getLocalizedCarClass(getCarCategory())}
            </Badge>
          </div>
        </div>
        {/* Alt info hissəsi */}
        <div className="bg-white dark:bg-brand-dark rounded-3xl p-6 px-10 info">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {car.brand} {car.model}
          </h3>
          <button
            aria-label="Toggle favorite"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(car.id);
            }}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:scale-110 transition"
          >
            <Heart
              className={`h-5 w-5 ${
                isFavorite(car.id)
                  ? "fill-brand-gold text-brand-gold"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            />
          </button>
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-[5px] pt-1">
            <Image
              src="/icons/location.svg"
              alt="location"
              height={10}
              width={10}
            />
            <span>27A Ahmed Racabli Baku Narimanov</span>
          </p>
          {/* Ayrıcı xətt */}
          <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
          <div>
            {/* Details grid */}
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
              <div className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 bg-gray-700 dark:bg-white"
                  style={{
                    WebkitMask: "url(/icons/mile.svg) no-repeat center",
                    mask: "url(/icons/mile.svg) no-repeat center",
                  }}
                />
                <span>{car.year}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 bg-gray-700 dark:bg-white"
                  style={{
                    WebkitMask: "url(/icons/fuel.svg) no-repeat center",
                    mask: "url(/icons/fuel.svg) no-repeat center",
                  }}
                />
                <span>{getLocalizedFuelType(car.fuelType)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 bg-gray-700 dark:bg-white"
                  style={{
                    WebkitMask: "url(/icons/Automatic.svg) no-repeat center",
                    mask: "url(/icons/Automatic.svg) no-repeat center",
                  }}
                />
                <span>{getLocalizedTransmission(car.transmission)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 bg-gray-700 dark:bg-white"
                  style={{
                    WebkitMask: "url(/icons/seat.svg) no-repeat center",
                    mask: "url(/icons/seat.svg) no-repeat center",
                  }}
                />
                <span>
                  {car.seats} {t.person}
                </span>
              </div>
            </div>
            <div className="flex items-center py-7 font-semibold justify-between">
              <h6 className="carPrice text-[24px]">
                {car.dailyPrice}₼{" "}
                <span className="text-[16px] font-light">{t.perDay}</span>
              </h6>
              <Button
                className="bg-brand-gold hover:bg-brand-gold/90 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transform transition-all duration-200"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Navigate to booking with car pre-selected
                  window.location.href = `/booking?car=${car.id}&lang=${currentLang}`;
                }}
              >
                {currentLang === "az"
                  ? "İndi Sifariş Et"
                  : currentLang === "en"
                  ? "Book Now"
                  : currentLang === "ru"
                  ? "Забронировать"
                  : "احجز الآن"}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default CarCard;
