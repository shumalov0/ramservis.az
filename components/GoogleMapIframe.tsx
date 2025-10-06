"use client";

import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Clock,
  Navigation,
  ExternalLink,
  Loader,
} from "lucide-react";

interface GoogleMapIframeProps {
  currentLang: string;
  className?: string;
}

const GoogleMapIframe: React.FC<GoogleMapIframeProps> = ({
  currentLang,
  className = "",
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Ram Servis məlumatları
  const companyInfo = {
    name: "RAM Rent a Car",
    address:
      process.env.NEXT_PUBLIC_COMPANY_ADDRESS ||
      "RAM Rent a Car, Bakı, Azərbaycan",
    lat: parseFloat(process.env.NEXT_PUBLIC_COMPANY_LAT || "40.4115292"),
    lng: parseFloat(process.env.NEXT_PUBLIC_COMPANY_LNG || "49.8612002"),
    phone: process.env.NEXT_PUBLIC_COMPANY_PHONE || "+994707004444",
    hours: {
      az: "24/7 Açıq",
      en: "24/7 Open",
      ru: "24/7 Открыто",
      ar: "24/7 مفتوح",
    },
  };

  const translations = {
    az: {
      title: "Bizim Ünvanımız",
      subtitle: "Bizi ziyarət edin və ya əlaqə saxlayın",
      address: "Ünvan",
      phone: "Telefon",
      hours: "İş saatları",
      getDirections: "Yol tarifi al",
      openInMaps: "Google Maps-də aç",
      viewLarger: "Böyük xəritədə bax",
      mapError: "Xəritə yüklənərkən xəta baş verdi",
      loading: "Xəritə yüklənir...",
      retryMap: "Yenidən cəhd et",
    },
    en: {
      title: "Our Location",
      subtitle: "Visit us or get in touch",
      address: "Address",
      phone: "Phone",
      hours: "Working Hours",
      getDirections: "Get Directions",
      openInMaps: "Open in Google Maps",
      viewLarger: "View larger map",
      mapError: "Error loading map",
      loading: "Loading map...",
      retryMap: "Retry",
    },
    ru: {
      title: "Наш Адрес",
      subtitle: "Посетите нас или свяжитесь с нами",
      address: "Адрес",
      phone: "Телефон",
      hours: "Рабочие часы",
      getDirections: "Построить маршрут",
      openInMaps: "Открыть в Google Maps",
      viewLarger: "Посмотреть на большой карте",
      mapError: "Ошибка загрузки карты",
      loading: "Загрузка карты...",
      retryMap: "Повторить",
    },
    ar: {
      title: "موقعنا",
      subtitle: "قم بزيارتنا أو تواصل معنا",
      address: "العنوان",
      phone: "الهاتف",
      hours: "ساعات العمل",
      getDirections: "احصل على الاتجاهات",
      openInMaps: "افتح في خرائط جوجل",
      viewLarger: "عرض خريطة أكبر",
      mapError: "خطأ في تحميل الخريطة",
      loading: "جاري تحميل الخريطة...",
      retryMap: "إعادة المحاولة",
    },
  };

  const t =
    translations[currentLang as keyof typeof translations] || translations.az;

  // Google Maps iframe URL-i - həqiqi RAM Rent a Car məkanı
  const createMapUrl = () => {
    // Həqiqi Google Maps embed URL-i RAM Rent a Car üçün
    const realMapUrl =
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3037.879092173129!2d49.8612002!3d40.4115292!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307db27358dc5f%3A0xcceeba8848fe3a6e!2sRAM%20Rent%20a%20Car!5e0!3m2!1saz!2saz!4v1759583052539!5m2!1saz!2saz";

    // Dil dəyişikliyinə görə URL-i yeniləyirik
    const langParam =
      currentLang === "az"
        ? "az"
        : currentLang === "en"
        ? "en"
        : currentLang === "ru"
        ? "ru"
        : "az";

    return realMapUrl.replace(/!2s[a-z]{2}!/g, `!2s${langParam}!`);
  };

  const handleGetDirections = () => {
    // Həqiqi Google Maps place ID istifadə edirik
    const url = `https://www.google.com/maps/dir/?api=1&destination=RAM+Rent+a+Car,Baku,Azerbaijan&destination_place_id=ChIJX9w4JzJ9N0ARbjoO-IiO7sw`;
    window.open(url, "_blank");
  };

  const handleOpenInMaps = () => {
    // Həqiqi Google Maps place ID istifadə edirik
    const url = `https://www.google.com/maps/place/RAM+Rent+a+Car/@${companyInfo.lat},${companyInfo.lng},17z/data=!3m1!4b1!4m6!3m5!1s0x40307db27358dc5f:0xcceeba8848fe3a6e!8m2!3d${companyInfo.lat}!4d${companyInfo.lng}!16s%2Fg%2F11y3k8qg0q`;
    window.open(url, "_blank");
  };

  const handleCallPhone = () => {
    window.open(`tel:${companyInfo.phone}`, "_self");
  };

  const handleMapLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleMapError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const retryMap = () => {
    setIsLoading(true);
    setHasError(false);
    // Force iframe reload
    const iframe = document.querySelector(
      "#google-map-iframe"
    ) as HTMLIFrameElement;
    if (iframe) {
      const src = iframe.src;
      iframe.src = "";
      setTimeout(() => {
        iframe.src = src;
      }, 100);
    }
  };

  return (
    <section className={`py-16 bg-white/70 dark:bg-[#1a1a1a] ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold bg-[#fffff] dark:bg-[#1a1a1a] dark:text-white mb-4">
            {t.title}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-lg p-6 h-full">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                {companyInfo.name}
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#f5b754] mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {t.address}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {companyInfo.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#f5b754] flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {t.phone}
                    </p>
                    <button
                      onClick={handleCallPhone}
                      className="text-[#f5b754] hover:text-yellow-400 text-sm font-medium transition-colors"
                    >
                      {companyInfo.phone}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#f5b754] flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {t.hours}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {
                        companyInfo.hours[
                          currentLang as keyof typeof companyInfo.hours
                        ]
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={handleGetDirections}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#f5b754] text-black rounded-lg hover:bg-yellow-400 transition-colors font-medium"
                >
                  <Navigation className="w-4 h-4" />
                  {t.getDirections}
                </button>

                <button
                  onClick={handleOpenInMaps}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <ExternalLink className="w-4 h-4" />
                  {t.openInMaps}
                </button>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-lg overflow-hidden h-96 lg:h-full min-h-[400px] relative">
              {/* Loading State */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-[#232323] z-10">
                  <div className="text-center">
                    <Loader className="w-8 h-8 text-[#f5b754] animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      {t.loading}
                    </p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-[#1a1a1a] z-10">
                  <div className="text-center p-6">
                    <MapPin className="w-12 h-12 text-[#f5b754] mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {t.mapError}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                      Xəritə yüklənmədi, amma siz hələ də bizim ünvanımızı tapa
                      bilərsiniz.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={retryMap}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#f5b754] text-black rounded-lg hover:bg-yellow-400 transition-colors text-sm"
                      >
                        <Loader className="w-4 h-4" />
                        {t.retryMap}
                      </button>
                      <button
                        onClick={handleOpenInMaps}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        {t.openInMaps}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Google Maps Iframe */}
              <iframe
                id="google-map-iframe"
                src={createMapUrl()}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`${companyInfo.name} - ${t.title}`}
                onLoad={handleMapLoad}
                onError={handleMapError}
                className="w-full h-full"
              />
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            📍 {companyInfo.address} | 📞 {companyInfo.phone}
          </p>
        </div>
      </div>
    </section>
  );
};

export default GoogleMapIframe;
