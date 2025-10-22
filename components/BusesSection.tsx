'use client';

import { FC } from 'react';
import Link from 'next/link';
import { Bus } from '@/lib/types';
import { Translation } from '@/lib/translations';
import BusCard from './BusCard';

interface BusesSectionProps {
  buses: Bus[];
  t: Translation;
  currentLang: string;
  getLocalizedBusType: (type: string) => string;
  getLocalizedFuelType: (fuelType: string) => string;
  getLocalizedTransmission: (transmission: string) => string;
  showViewAllButton?: boolean;
  showTitle?: boolean;
}

const BusesSection: FC<BusesSectionProps> = ({
  buses,
  t,
  currentLang,
  getLocalizedBusType,
  getLocalizedFuelType,
  getLocalizedTransmission,
  showViewAllButton = true,
  showTitle = true,
}) => {
  return (
    <section className="py-16 bg-white dark:bg-zinc-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {showTitle && (
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t.ourBusFleet || 'Avtobus Parkımız'}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t.busFleetDescription || 'Müxtəlif ölçülərdə və komfort səviyyələrində avtobuslarımız'}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {buses.map((bus) => (
            <Link key={bus.id} href={`/bus/${bus.id}`} className="block">
              <BusCard
                bus={{
                  name: `${bus.brand} ${bus.model}`,
                  capacity: `${bus.capacity} nəfər`,
                  features: bus.features,
                  image: bus.image,
                  pricePerDay: bus.dailyPrice.toString(),
                }}
                t={t}
                currentLang={currentLang}
              />
            </Link>
          ))}
        </div>

        {showViewAllButton && buses.length > 6 && (
          <div className="text-center mt-12">
            <Link
              href="/buses"
              className="inline-flex items-center px-8 py-3 bg-brand-gold hover:bg-brand-gold/90 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              {currentLang === 'az' ? 'Bütün Avtobusları Gör' :
               currentLang === 'en' ? 'View All Buses' :
               currentLang === 'ru' ? 'Посмотреть все автобусы' :
               'عرض جميع الحافلات'}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default BusesSection;