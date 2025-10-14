'use client';

import { useState, useEffect } from 'react';
import FixedHeader from '@/components/FixedHeader';
import Footer from '@/components/Footer';
import { useTranslation } from '@/lib/translations';
import { Car, Users, Award, MapPin } from 'lucide-react';
import GoogleReviews from '@/components/GoogleReviews';
import { CertificatesCarousel } from '@/components/CertificatesCarousel';
import { certificates } from '@/lib/data';

export default function AboutPage() {
  const [currentLang, setCurrentLang] = useState('az');
  const t = useTranslation(currentLang);

  useEffect(() => {
    const savedLang = localStorage.getItem('ramservis_language');
    if (savedLang && ['az', 'en', 'ru', 'ar'].includes(savedLang)) {
      setCurrentLang(savedLang);
    }
  }, []);

  const handleLanguageChange = (lang: string) => {
    setCurrentLang(lang);
    localStorage.setItem('ramservis_language', lang);
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-gray-50 dark:from-zinc-800 dark:bg-brand-dark/70  transition-colors duration-300">
      <FixedHeader currentLang={currentLang} handleLanguageChange={handleLanguageChange} t={t} />
      
      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {t.aboutTitle}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t.aboutSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div className="bg-white dark:bg-brand-dark/70  rounded-2xl shadow-xl p-8">
              <div className="flex items-center mb-6">
                <div className="bg-amber-100 dark:bg-brand-dark/70  p-3 rounded-full mr-4">
                  <Car className="h-6 w-6 text-brand-gold dark:text-brand-gold" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t.mission}</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                {t.missionText}
              </p>
            </div>

            <div className="bg-white dark:bg-brand-dark/70  rounded-2xl shadow-xl p-8">
              <div className="flex items-center mb-6">
                <div className="bg-amber-100 dark:bg-brand-dark/70  p-3 rounded-full mr-4">
                  <Award className="h-6 w-6 text-brand-gold dark:text-brand-gold" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t.vision}</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                {t.visionText}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-brand-dark/70  rounded-2xl shadow-xl p-8 mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
              {t.values}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto">
              {t.valuesText}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white dark:bg-brand-dark/70  rounded-2xl shadow-xl p-8 text-center">
              <div className="bg-amber-100 dark:bg-amber-900/30 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-brand-gold dark:text-brand-gold" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t.experience}</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t.experienceText}
              </p>
            </div>

            <div className="bg-white dark:bg-brand-dark/70  rounded-2xl shadow-xl p-8 text-center">
              <div className="bg-amber-100 dark:bg-brand-dark/70  p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Car className="h-8 w-8 text-brand-gold dark:text-brand-gold" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t.fleet}</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t.fleetText}
              </p>
            </div>

            <div className="bg-white dark:bg-brand-dark/70 rounded-2xl shadow-xl p-8 text-center">
              <div className="bg-amber-100 dark:bg-brand-dark/70  p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <MapPin className="h-8 w-8 text-brand-gold dark:text-brand-gold" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t.service}</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t.serviceText}
              </p>
            </div>
          </div>

          {/* Certificates Section */}
          <div className="bg-white dark:bg-brand-dark/70 rounded-2xl shadow-xl p-8 mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
              {t.certificatesTitle}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto mb-8">
              {t.certificatesDesc}
            </p>
            <CertificatesCarousel
              certificates={certificates}
              autoPlay={false}
              showDots={true}
              currentLang={currentLang}
            />
          </div>
        </div>
      </div>

      {/* Customer Reviews */}
      <GoogleReviews
        maxReviews={4}
        showRating={true}
        currentLang={currentLang}
        className="bg-white dark:bg-brand-dark/70"
      />
      
      <Footer t={t} />
    </div>
  );
}