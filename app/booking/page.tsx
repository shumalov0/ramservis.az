'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import FixedHeader from '@/components/FixedHeader';
import Footer from '@/components/Footer';
import { useTranslation } from '@/lib/translations';
import { cars } from '@/lib/data';

export default function BookingPage() {
  const [currentLang, setCurrentLang] = useState('az');
  const t = useTranslation(currentLang);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const savedLang = localStorage.getItem('ramservis_language');
    if (savedLang && ['az', 'en', 'ru', 'ar'].includes(savedLang)) {
      setCurrentLang(savedLang);
    }

    // Maşın ID-si varsa, car detail səhifəsinə yönləndir
    const carId = searchParams.get('car');
    const lang = searchParams.get('lang') || currentLang;
    
    if (carId) {
      router.replace(`/car/${carId}?lang=${lang}`);
    } else {
      // Maşın seçilməyibsə, cars səhifəsinə yönləndir
      router.replace(`/cars?lang=${lang}`);
    }
  }, [searchParams, currentLang, router]);

  const handleLanguageChange = (lang: string) => {
    setCurrentLang(lang);
    localStorage.setItem('ramservis_language', lang);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <FixedHeader currentLang={currentLang} handleLanguageChange={handleLanguageChange} t={t} />
      
      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            {currentLang === 'az' ? 'Rezervasiya' : 
             currentLang === 'en' ? 'Booking' :
             currentLang === 'ru' ? 'Бронирование' : 'الحجز'}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            {currentLang === 'az' ? 'Yönləndirilir...' : 
             currentLang === 'en' ? 'Redirecting...' :
             currentLang === 'ru' ? 'Перенаправление...' : 'إعادة توجيه...'}
          </p>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
        </div>
      </div>
      
      <Footer t={t} />
    </div>
  );
}