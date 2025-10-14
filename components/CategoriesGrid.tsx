'use client';

import { useRouter } from 'next/navigation';
import { Car, CarFront, Bus, CarTaxiFront } from 'lucide-react';

type Category = { key: string; label: string; icon: React.ComponentType<{ className?: string }>; categoryName: string };

// Map visual categories to our existing category values in data.ts
const categories: Category[] = [
  { key: 'luxury', label: 'Luxury Cars', icon: Car, categoryName: 'Lüks' },
  { key: 'suv', label: 'SUVs', icon: Car, categoryName: 'SUV' },
  { key: 'hatchback', label: 'Hatchback', icon: Car, categoryName: 'Hatchback' },
  { key: 'sedan', label: 'Sedan', icon: CarTaxiFront, categoryName: 'Sedan' },
  { key: 'minivan', label: 'Minivan', icon: Bus, categoryName: 'Minivan' },
  { key: 'business', label: 'Business', icon: CarFront, categoryName: 'Biznes' },
  { key: 'economy', label: 'Economy', icon: Car, categoryName: 'Ekonom' },
  { key: 'small', label: 'Small Cars', icon: Car, categoryName: 'Ekonom' },
];

interface CategoriesGridProps {
  currentLang?: string;
  t?: any;
}

export default function CategoriesGrid({ currentLang = 'az', t }: CategoriesGridProps) {
  const router = useRouter();
  
  const goToCategory = (categoryName: string) => {
    router.push(`/cars?category=${encodeURIComponent(categoryName)}`);
  };

  // Get localized category names
  const getLocalizedCategoryName = (label: string) => {
    const categoryMap: Record<string, Record<string, string>> = {
      'Luxury Cars': { az: 'Lüks Maşınlar', en: 'Luxury Cars', ru: 'Люкс Автомобили', ar: 'سيارات فاخرة' },
      'SUVs': { az: 'SUV Maşınlar', en: 'SUVs', ru: 'Внедорожники', ar: 'سيارات دفع رباعي' },
      'Hatchback': { az: 'Hatchback', en: 'Hatchback', ru: 'Хэтчбек', ar: 'هاتشباك' },
      'Sedan': { az: 'Sedan', en: 'Sedan', ru: 'Седан', ar: 'سيدان' },
      'Minivan': { az: 'Minivan', en: 'Minivan', ru: 'Минивэн', ar: 'ميني فان' },
      'Business': { az: 'Biznes', en: 'Business', ru: 'Бизнес', ar: 'أعمال' },
      'Economy': { az: 'Ekonom', en: 'Economy', ru: 'Эконом', ar: 'اقتصادي' },
      'Small Cars': { az: 'Kiçik Maşınlar', en: 'Small Cars', ru: 'Малые Автомобили', ar: 'سيارات صغيرة' },
    };
    return categoryMap[label]?.[currentLang] || label;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {categories.map(({ key, label, icon: Icon, categoryName }) => (
        <button
          key={key}
          onClick={() => goToCategory(categoryName)}
          className="rounded-2xl border bg-white/70 dark:bg-brand-dark/70 backdrop-blur p-6 flex flex-col items-center justify-center hover:border-brand-gold transition-colors"
        >
          <Icon className="h-10 w-10 text-brand-gold" />
          <p className="mt-3 text-sm font-medium">{getLocalizedCategoryName(label)}</p>
        </button>
      ))}
    </div>
  );
}


