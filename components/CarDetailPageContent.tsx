"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  Fuel,
  Settings,
  Calendar,
  CheckCircle,
  AlertCircle,
  Star,
} from "lucide-react";
import { Car } from "@/lib/data";
import { useTranslation } from "@/lib/translations";
import CarDetailClient from "@/components/CarDetailClient";
import { useFavorites } from "@/hooks/use-favorites";
import FixedHeader from "./FixedHeader";
import { ImageGallery } from "@/components/gallery";
import {
  AvailabilityStatus,
  SimilarCars,
  CustomerReviews,
  SocialShare,
  FavoriteButton,
} from "@/components/dynamic";
import { InlineBookingForm } from "@/components/booking";
import { EnhancedCar, BookingFormData } from "@/lib/types";

interface CarDetailPageContentProps {
  car: Car;
  enhancedCar: EnhancedCar;
  initialLang: string;
}

export default function CarDetailPageContent({
  car,
  enhancedCar,
  initialLang,
}: CarDetailPageContentProps) {
  const [currentLang, setCurrentLang] = useState(initialLang);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const t = useTranslation(currentLang);
  const {} = useFavorites();
  const bookingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedLang = localStorage.getItem("ramservis_language");
    if (savedLang && ["az", "en", "ru", "ar"].includes(savedLang)) {
      setCurrentLang(savedLang);
    }
  }, []);

  // Removed automatic scroll to avoid navigation blocking
  // Users can manually scroll to the form

  const handleLanguageChange = (lang: string) => {
    setCurrentLang(lang);
    localStorage.setItem("ramservis_language", lang);
  };

  const getLocalizedFuelType = (fuelType: string) => {
    const fuelMap: Record<string, Record<string, string>> = {
      Benzin: { az: "Benzin", en: "Gasoline", ru: "Бензин", ar: "بنزين" },
      Dizel: { az: "Dizel", en: "Diesel", ru: "Дизель", ar: "ديزل" },
      Hybrid: { az: "Hibrid", en: "Hybrid", ru: "Гибрид", ar: "هجين" },
    };
    return fuelMap[fuelType]?.[currentLang] || fuelType;
  };

  const getLocalizedTransmission = (transmission: string) => {
    const transmissionMap: Record<string, Record<string, string>> = {
      Avtomat: {
        az: "Avtomat",
        en: "Automatic",
        ru: "Автомат",
        ar: "أوتوماتيك",
      },
      Mexanika: { az: "Mexanika", en: "Manual", ru: "Механика", ar: "يدوي" },
    };
    return transmissionMap[transmission]?.[currentLang] || transmission;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br   from-zinc-50 to-gray-50 dark:from-zinc-800 dark:bg-brand-dark/70  duration-300">
      <FixedHeader
        currentLang={currentLang}
        handleLanguageChange={handleLanguageChange}
        t={t}
      />
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-20 sm:pt-24 pb-8 sm:pb-12 w-full overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Car Image and Gallery */}
          <div className="space-y-6">
            <ImageGallery
              images={
                enhancedCar.gallery && enhancedCar.gallery.length > 0
                  ? enhancedCar.gallery
                  : [car.image]
              }
              carInfo={{ brand: car.brand, model: car.model, year: car.year }}
              thumbnailLayout="horizontal"
              enableLazyLoading={true}
            />

            {/* Features */}
            <Card className="bg-white/80 dark:bg-brand-dark/70  backdrop-blur-sm border border-gray-200/20 dark:border-gray-700/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span>{t.features}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {car.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Car Details and Booking */}
          <div className="space-y-8">
            {/* Car Info */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {car.brand} {car.model}
                  </h1>
                  <p className="text-2xl font-semibold text-[#f5b754] dark:text-[#f5b754] mb-2">
                    ₼{car.dailyPrice}
                    {t.perDay} başlayaraq
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <SocialShare car={enhancedCar} />
                  <FavoriteButton
                    carId={car.id}
                    carName={`${car.brand} ${car.model}`}
                    size="lg"
                    showLabel={false}
                  />
                </div>
              </div>

              {/* Real-time Availability Status */}
              <div className="mb-6">
                <AvailabilityStatus carId={car.id} />
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t.year}
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {car.year}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Tutum
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {car.seats} {t.person}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Fuel className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Yanacaq
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {getLocalizedFuelType(car.fuelType)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Settings className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Transmissiya
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {getLocalizedTransmission(car.transmission)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <Card className="bg-white/80 dark:bg-brand-dark/70  backdrop-blur-sm border border-gray-200/20 dark:border-gray-700/20">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">
                  {t.priceInfo}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">
                    {t.dailyPrice}:
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ₼{car.dailyPrice}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">
                    {t.weeklyPrice}:
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ₼{car.weeklyPrice}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">
                    {t.monthlyPrice}:
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ₼{car.monthlyPrice}
                  </span>
                </div>
                <Separator className="bg-gray-200 dark:bg-brand-dark/70 " />
                <div className="flex justify-between items-center text-red-600 dark:text-red-400">
                  <span>{t.deposit}:</span>
                  <span className="font-semibold">₼{car.deposit}</span>
                </div>
              </CardContent>
            </Card>

            {/* Rules */}
            <Card className="bg-white/80 dark:bg-brand-dark/70  backdrop-blur-sm border border-gray-200/20 dark:border-gray-700/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
                  <AlertCircle className="h-5 w-5 text-[#f5b754]" />
                  <span>{t.rentalRules}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">
                    {t.minimumAge}:
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {car.rules.minimumAge} yaş
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">
                    {t.drivingExperience}:
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {car.rules.drivingExperience} il
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">
                    {t.passportRequired}:
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {car.rules.passportRequired ? t.yes : t.no}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">
                    {t.licenseRequired}:
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {car.rules.licenseRequired ? t.required : t.notRequired}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Contact Options - Client Component */}
            <CarDetailClient
              car={car}
              currentLang={currentLang}
              onShowBookingForm={() => {
                // Prevent navigation issues by using setTimeout
                setTimeout(() => {
                  setShowBookingForm(true);
                  // Gentle scroll to form after state update, leaving space for header
                  setTimeout(() => {
                    if (bookingRef.current) {
                      const headerHeight = 80; // Header height
                      const elementTop =
                        bookingRef.current.offsetTop - headerHeight;
                      window.scrollTo({
                        top: elementTop,
                        behavior: "smooth",
                      });
                    }
                  }, 150);
                }, 0);
              }}
            />
          </div>
        </div>

        {/* Enhanced Inline Booking Form - Appears when user clicks the booking button */}
        {showBookingForm && (
          <div
            id="booking-form"
            ref={bookingRef}
            className="mt-16 relative z-10"
            style={{ isolation: "isolate" }}
          >
            <InlineBookingForm
              car={enhancedCar}
              onBookingSubmit={async (data: BookingFormData) => {
                try {
                  // Handle successful booking submission
                  console.log("Booking submitted:", data);

                  // Send WhatsApp message for online payments
                  if (data.paymentMethod === "online" && data.paymentLink) {
                    const message = `Yeni online rezervasiya:\n\nMüştəri: ${data.firstName} ${data.lastName}\nEmail: ${data.email}\nTelefon: ${data.phone}\nMaşın: ${car.brand} ${car.model} (${car.year})\nTarix: ${data.pickupDate} - ${data.dropoffDate}\nÜmumi məbləğ: ${data.totalPrice} AZN\nÖdəniş linki: ${data.paymentLink}`;
                    const whatsappUrl = `https://wa.me/+994708559001?text=${encodeURIComponent(
                      message
                    )}`;
                    window.open(whatsappUrl, "_blank");
                  }
                } catch (error) {
                  console.error("Booking submission error:", error);
                }
              }}
              onCancel={() => {
                // Clean up and close form properly
                setShowBookingForm(false);
                // Scroll back to top of car details
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              currentLang={currentLang}
              showPriceCalculation={true}
            />
          </div>
        )}
        {/* Customer Reviews Section */}
        <div className="mt-8 sm:mt-12 lg:mt-16 w-full overflow-hidden">
          <CustomerReviews
            carId={car.id}
            carModel={`${car.brand} ${car.model}`}
          />
        </div>

        {/* Similar Cars Recommendations */}
        <div className="mt-8 sm:mt-12 lg:mt-16 w-full overflow-hidden">
          <SimilarCars currentCar={enhancedCar} />
        </div>
      </div>
    </div>
  );
}
