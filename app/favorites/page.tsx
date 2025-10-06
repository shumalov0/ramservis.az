'use client';

import { FavoritesManager } from '@/components/dynamic';
import FixedHeader from '@/components/FixedHeader';
import { useState } from 'react';
import { useTranslation } from '@/lib/translations';

export default function FavoritesPage() {
  const [currentLang, setCurrentLang] = useState('az');
  const t = useTranslation(currentLang);

  const handleLanguageChange = (lang: string) => {
    setCurrentLang(lang);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-gray-50 dark:from-zinc-800 dark:bg-brand-dark/70">
      <FixedHeader currentLang={currentLang} handleLanguageChange={handleLanguageChange} t={t} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <FavoritesManager />
      </div>
    </div>
  );
}

