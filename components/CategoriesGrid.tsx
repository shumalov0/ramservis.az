'use client';

import { useRouter } from 'next/navigation';
import { Car, CarFront, Bus, CarTaxiFront } from 'lucide-react';

type Category = { key: string; label: string; icon: React.ComponentType<{ className?: string }>; classValue: string };

// Map visual categories to our existing class values in data.ts
const categories: Category[] = [
  { key: 'luxury', label: 'Luxury Cars', icon: Car, classValue: 'Lüks' },
  { key: 'sport', label: 'Sport Cars', icon: CarFront, classValue: 'Premium' },
  { key: 'suv', label: 'SUVs', icon: Car, classValue: 'SUV' },
  { key: 'convertible', label: 'Convertible', icon: CarFront, classValue: 'Premium' },
  { key: 'hatchback', label: 'Hatchback', icon: Car, classValue: 'Ekonom' },
  { key: 'sedan', label: 'Sedan', icon: CarTaxiFront, classValue: 'Biznes' },
  { key: 'minivan', label: 'Minivan', icon: Bus, classValue: 'SUV' },
  { key: 'small', label: 'Small Cars', icon: Car, classValue: 'Ekonom' },
];

export default function CategoriesGrid() {
  const router = useRouter();
  const goToClass = (classValue: string) => {
    router.push(`/cars?class=${encodeURIComponent(classValue)}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {categories.map(({ key, label, icon: Icon, classValue }) => (
        <button
          key={key}
          onClick={() => goToClass(classValue)}
          className="rounded-2xl border bg-white/70 dark:bg-brand-dark/70 backdrop-blur p-6 flex flex-col items-center justify-center hover:border-brand-gold transition-colors"
        >
                      <Icon className="h-10 w-10 text-brand-gold" />
          <p className="mt-3 text-sm font-medium">{label}</p>
        </button>
      ))}
    </div>
  );
}


