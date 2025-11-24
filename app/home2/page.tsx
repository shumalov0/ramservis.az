"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslation } from "@/lib/translations";
import { Car, Shield, Clock, Award, MapPin, Phone, Mail, Star } from "lucide-react";
import Link from "next/link";
import { cars } from "@/lib/data";

export default function Home2() {
  const [currentLang, setCurrentLang] = useState("az");
  const t = useTranslation(currentLang);

  useEffect(() => {
    const savedLang = localStorage.getItem("ramservis_language");
    if (savedLang && ["az", "en", "ru", "ar"].includes(savedLang)) {
      setCurrentLang(savedLang);
    }
  }, []);

  const handleLanguageChange = (lang: string) => {
    setCurrentLang(lang);
    localStorage.setItem("ramservis_language", lang);
  };

  const features = [
    {
      icon: Car,
      title: { az: "Geniş Avtomobil Parkı", en: "Wide Car Fleet", ru: "Широкий Автопарк" },
      desc: { az: "Ekonomdan lüks sinfə qədər", en: "From economy to luxury class", ru: "От эконома до люкс класса" }
    },
    {
      icon: Shield,
      title: { az: "Tam Sığorta", en: "Full Insurance", ru: "Полная Страховка" },
      desc: { az: "Bütün risklərdən qorunma", en: "Protection from all risks", ru: "Защита от всех рисков" }
    },
    {
      icon: Clock,
      title: { az: "24/7 Dəstək", en: "24/7 Support", ru: "24/7 Поддержка" },
      desc: { az: "Hər zaman yanınızdayıq", en: "Always by your side", ru: "Всегда рядом с вами" }
    },
    {
      icon: Award,
      title: { az: "Keyfiyyət Zəmanəti", en: "Quality Guarantee", ru: "Гарантия Качества" },
      desc: { az: "Yüksək standartlar", en: "High standards", ru: "Высокие стандарты" }
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-brand-dark transition-colors duration-300">
      <Header
        currentLang={currentLang}
        handleLanguageChange={handleLanguageChange}
        t={t}
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0">
          <Image
            src="/cars/12.jpg"
            alt="Hero"
            fill
            priority
            quality={85}
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <div className="inline-block">
              <span className="text-brand-gold text-sm font-semibold tracking-[0.3em] uppercase">
                {currentLang === "az" ? "Premium Avtomobil İcarəsi" : 
                 currentLang === "en" ? "Premium Car Rental" : 
                 "Премиум Аренда Авто"}
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              {currentLang === "az" ? "İdeal Avtomobil" : 
               currentLang === "en" ? "Ideal Car" : 
               "Идеальный Автомобиль"}
              <br />
              <span className="text-brand-gold">
                {currentLang === "az" ? "Sizin Üçün" : 
                 currentLang === "en" ? "For You" : 
                 "Для Вас"}
              </span>
            </h1>

            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {currentLang === "az" ? "Bakıda ən yaxşı qiymətlərlə premium avtomobil icarəsi. Rahat, təhlükəsiz və sərfəli." : 
               currentLang === "en" ? "Premium car rental at the best prices in Baku. Comfortable, safe and affordable." : 
               "Премиум аренда авто по лучшим ценам в Баку. Комфортно, безопасно и выгодно."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link
                href="/cars"
                className="px-8 py-4 bg-brand-gold text-black font-bold rounded-lg hover:bg-brand-gold/90 transition-all transform hover:scale-105 shadow-lg"
              >
                {currentLang === "az" ? "Avtomobilləri Gör" : 
                 currentLang === "en" ? "View Cars" : 
                 "Смотреть Авто"}
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-black transition-all"
              >
                {currentLang === "az" ? "Əlaqə" : 
                 currentLang === "en" ? "Contact" : 
                 "Контакт"}
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-brand-gold rounded-full flex justify-center">
            <div className="w-1 h-3 bg-brand-gold rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-brand-gold text-sm font-semibold tracking-[0.3em] uppercase">
              {currentLang === "az" ? "Niyə Biz?" : 
               currentLang === "en" ? "Why Us?" : 
               "Почему Мы?"}
            </span>
            <h2 className="text-4xl font-bold mt-4 text-gray-900 dark:text-white">
              {currentLang === "az" ? "Üstünlüklərimiz" : 
               currentLang === "en" ? "Our Advantages" : 
               "Наши Преимущества"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 group"
              >
                <div className="w-16 h-16 bg-brand-gold/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand-gold/20 transition-colors">
                  <feature.icon className="w-8 h-8 text-brand-gold" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  {feature.title[currentLang as keyof typeof feature.title]}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.desc[currentLang as keyof typeof feature.desc]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Cars Section */}
      <section className="py-20 bg-white dark:bg-brand-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-brand-gold text-sm font-semibold tracking-[0.3em] uppercase">
              {currentLang === "az" ? "Populyar Seçimlər" : 
               currentLang === "en" ? "Popular Choices" : 
               "Популярные Выборы"}
            </span>
            <h2 className="text-4xl font-bold mt-4 text-gray-900 dark:text-white">
              {currentLang === "az" ? "Ən Çox Seçilən Avtomobillər" : 
               currentLang === "en" ? "Most Popular Cars" : 
               "Самые Популярные Авто"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.slice(0, 6).map((car) => (
              <Link
                key={car.id}
                href={`/car/${car.id}`}
                className="group bg-gray-50 dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={car.image}
                    alt={`${car.brand} ${car.model}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    quality={75}
                  />
                  <div className="absolute top-4 right-4 bg-brand-gold text-black px-4 py-2 rounded-lg font-bold">
                    {car.dailyPrice}₼
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-brand-gold transition-colors">
                    {car.brand} {car.model}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {car.year} • {car.transmission}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {currentLang === "az" ? "Gündəlik" : 
                       currentLang === "en" ? "Per Day" : 
                       "В День"}
                    </span>
                    <span className="text-brand-gold font-semibold">
                      {currentLang === "az" ? "Ətraflı →" : 
                       currentLang === "en" ? "Details →" : 
                       "Подробнее →"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/cars"
              className="inline-block px-8 py-4 bg-brand-gold text-black font-bold rounded-lg hover:bg-brand-gold/90 transition-all transform hover:scale-105"
            >
              {currentLang === "az" ? "Bütün Avtomobilləri Gör" : 
               currentLang === "en" ? "View All Cars" : 
               "Смотреть Все Авто"}
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/cars/search.jpg"
            alt="CTA Background"
            fill
            sizes="100vw"
            className="object-cover"
            loading="lazy"
            quality={80}
          />
          <div className="absolute inset-0 bg-black/70"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-brand-gold text-sm font-semibold tracking-[0.3em] uppercase">
            {currentLang === "az" ? "İndi Sifariş Et" : 
             currentLang === "en" ? "Book Now" : 
             "Закажите Сейчас"}
          </span>
          <h2 className="text-5xl font-bold mt-4 mb-6 text-white">
            {currentLang === "az" ? "Səyahətinizə Başlayın" : 
             currentLang === "en" ? "Start Your Journey" : 
             "Начните Ваше Путешествие"}
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            {currentLang === "az" ? "Ən yaxşı qiymətlərlə premium avtomobil icarəsi" : 
             currentLang === "en" ? "Premium car rental at the best prices" : 
             "Премиум аренда авто по лучшим ценам"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/booking"
              className="px-8 py-4 bg-brand-gold text-black font-bold rounded-lg hover:bg-brand-gold/90 transition-all transform hover:scale-105 shadow-lg"
            >
              {currentLang === "az" ? "İndi Sifariş Et" : 
               currentLang === "en" ? "Book Now" : 
               "Заказать Сейчас"}
            </Link>
            <a
              href="tel:+994123456789"
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              {currentLang === "az" ? "Zəng Et" : 
               currentLang === "en" ? "Call Us" : 
               "Позвонить"}
            </a>
          </div>
        </div>
      </section>

      <Footer t={t} />
    </div>
  );
}
