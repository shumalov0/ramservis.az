"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CarsSection from "@/components/CarsSection";
import Footer from "@/components/Footer";
import { cars, enhancedCars } from "@/lib/data";
import { useTranslation } from "@/lib/translations";
import BookingBar from "@/components/BookingBar";
import CategoriesGrid from "@/components/CategoriesGrid";
import Advanced from "@/components/Advanced";
import LoadingSpinner from "@/components/LoadingSpinner";

// Lazy load heavy components to improve initial page load
const GoogleReviews = lazy(() => import("@/components/GoogleReviews"));
const CertificatesCarousel = lazy(() =>
  import("@/components/CertificatesCarousel").then((module) => ({
    default: module.CertificatesCarousel,
  }))
);
const OtherCarsSection = lazy(() => import("@/components/OtherCarsSection"));
const GoogleMapIframe = lazy(() => import("@/components/GoogleMapIframe"));

import { certificates } from "@/lib/data";

export default function Home() {
  const [currentLang, setCurrentLang] = useState("az");
  const t = useTranslation(currentLang);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedLang = localStorage.getItem("ramservis_language");
    if (savedLang && ["az", "en", "ru", "ar"].includes(savedLang)) {
      setCurrentLang(savedLang);
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const handleLanguageChange = (lang: string) => {
    setCurrentLang(lang);
    localStorage.setItem("ramservis_language", lang);
  };

  const getLocalizedCarClass = (carClass: string) => {
    const classMap: Record<string, Record<string, string>> = {
      Ekonom: { az: "Ekonom", en: "Economy", ru: "Эконом" },
      Biznes: { az: "Biznes", en: "Business", ru: "Бизнес" },
      Premium: { az: "Premium", en: "Premium", ru: "Премиум" },
      Lüks: { az: "Lüks", en: "Luxury", ru: "Люкс" },
      Komfort: { az: "Komfort", en: "Comfort", ru: "Комфорт" },
      SUV: { az: "SUV", en: "SUV", ru: "Внедорожник" },
    };
    return classMap[carClass]?.[currentLang] || carClass;
  };

  const getLocalizedFuelType = (fuelType: string) => {
    const fuelMap: Record<string, Record<string, string>> = {
      Benzin: { az: "Benzin", en: "Gasoline", ru: "Бензин" },
      Dizel: { az: "Dizel", en: "Diesel", ru: "Дизель" },
      Hybrid: { az: "Hibrid", en: "Hybrid", ru: "Гибрид" },
    };
    return fuelMap[fuelType]?.[currentLang] || fuelType;
  };

  const getLocalizedTransmission = (transmission: string) => {
    const transmissionMap: Record<string, Record<string, string>> = {
      Avtomat: { az: "Avtomat", en: "Automatic", ru: "Автомат" },
      Mexanika: { az: "Mexanika", en: "Manual", ru: "Механика" },
    };
    return transmissionMap[transmission]?.[currentLang] || transmission;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-gray-50 dark:from-zinc-800 dark:bg-brand-dark/70 transition-colors duration-300">
      {/* Header */}
      <Header
        currentLang={currentLang}
        handleLanguageChange={handleLanguageChange}
        t={t}
      />

      {/* Loading state */}
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[70vh]">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          {/* Hero */}
          <HeroSection t={t} />

          {/* Features */}
          <section className="py-16 bg-white/70 dark:bg-brand-dark/70">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Advanced t={t} />
            </div>
          </section>

          {/* BookingBar */}
          <section
            className="relative flex items-center justify-center bg-fixed bg-center bg-cover py-10 h-[100%] md:h-96"
            style={{ backgroundImage: "url('/cars/search.jpg')" }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="relative z-10 max-w-6xl w-full px-4 ">
              <div className="text flex flex-col text-center  justify-center items-center ">
                <p className="text-[10px] sari">Rent Now</p>
                <h2 className="bookau text-4xl md:text-6xl font-bold text-white mb-8">
                  Book Auto Rental
                </h2>
              </div>
              <BookingBar />
            </div>
          </section>

          {/* Categories */}
          <section className="py-16 bg-white/70 dark:bg-[#1a1a1a]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <CategoriesGrid />
            </div>
          </section>

          {/* Most Ordered Cars */}
          <section className="py-20 dark:bg-brand-dark/70">
            <CarsSection
              cars={cars}
              t={t}
              currentLang={currentLang}
              getLocalizedCarClass={getLocalizedCarClass}
              getLocalizedFuelType={getLocalizedFuelType}
              getLocalizedTransmission={getLocalizedTransmission}
              showViewAllButton={true}
              showTitle={true}
            />
          </section>

          {/* Other Cars Section */}
          <Suspense
            fallback={
              <div className="py-16">
                <LoadingSpinner />
              </div>
            }
          >
            <OtherCarsSection
              cars={enhancedCars}
              excludeIds={cars.slice(0, 6).map((car) => car.id)} // Exclude first 6 cars shown in main section
              maxCars={12}
              currentLang={currentLang}
              t={t}
              getLocalizedCarClass={getLocalizedCarClass}
              getLocalizedFuelType={getLocalizedFuelType}
              getLocalizedTransmission={getLocalizedTransmission}
            />
          </Suspense>

          {/* Customer Reviews */}
          <Suspense
            fallback={
              <div className="py-16">
                <LoadingSpinner />
              </div>
            }
          >
            <GoogleReviews
              maxReviews={8}
              showRating={true}
              currentLang={currentLang}
              useGoogleAPI={false}
              minRating={4}
            />
          </Suspense>

          {/* Certificates Carousel */}
          <section className="py-16 bg-white/70 dark:bg-brand-dark/70">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {currentLang === "az"
                    ? "Sertifikatlarımız"
                    : currentLang === "en"
                    ? "Our Certificates"
                    : currentLang === "ru"
                    ? "Наши сертификаты"
                    : "شهاداتنا"}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  {currentLang === "az"
                    ? "Keyfiyyət və etibarlılığımızı təsdiq edən rəsmi sertifikatlar"
                    : currentLang === "en"
                    ? "Official certificates confirming our quality and reliability"
                    : currentLang === "ru"
                    ? "Официальные сертификаты, подтверждающие наше качество и надежность"
                    : "الشهادات الرسمية التي تؤكد جودتنا وموثوقيتنا"}
                </p>
              </div>
              <Suspense
                fallback={
                  <div className="py-8">
                    <LoadingSpinner />
                  </div>
                }
              >
                <CertificatesCarousel
                  certificates={certificates}
                  autoPlay={false}
                  showDots={true}
                  currentLang={currentLang}
                />
              </Suspense>
            </div>
          </section>
        </>
      )}
      {/* Location Map */}
      <Suspense
        fallback={
          <div className="py-16">
            <LoadingSpinner />
          </div>
        }
      >
        <GoogleMapIframe currentLang={currentLang} />
      </Suspense>
      {/* Footer */}
      <Footer t={t} />
    </div>
  );
}
