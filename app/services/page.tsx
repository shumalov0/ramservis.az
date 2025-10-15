'use client';

import { useEffect, useState } from 'react';
import FixedHeader from '@/components/FixedHeader';
import Footer from '@/components/Footer';
import { useTranslation } from '@/lib/translations';
import ServicesSections from '@/components/ServicesSections';
import ServiceHero from '@/components/services/ServiceHero';

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
    <div className="min-h-screen bg-white dark:bg-zinc-900 transition-colors duration-300">
      <FixedHeader currentLang={currentLang} handleLanguageChange={handleLanguageChange} t={t} />
      <div className="pt-20">
        <ServiceHero t={t} />
        <ServicesSections t={t} />
      </div>
      <Footer t={t} />
    </div>
  );
}


