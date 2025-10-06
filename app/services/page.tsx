'use client';

import { useEffect, useState } from 'react';
import FixedHeader from '@/components/FixedHeader';
import Footer from '@/components/Footer';
import { useTranslation } from '@/lib/translations';
import ServicesSections from '@/components/ServicesSections';

export default function ServicesPage() {
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
    <div className="min-h-screen bg-gradient-to-br  from-zinc-50 to-gray-50 dark:from-zinc-800 dark:bg-brand-dark/70  transition-colors duration-300">
      <FixedHeader currentLang={currentLang} handleLanguageChange={handleLanguageChange} t={t} />
      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
            {t.services || 'Xidmətlər'}
          </h1>
          <ServicesSections />
        </div>
      </div>
      <Footer t={t} />
    </div>
  );
}


