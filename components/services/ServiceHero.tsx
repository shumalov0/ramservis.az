'use client';

import { Car, Shield, Clock, MapPin } from 'lucide-react';

interface ServiceHeroProps {
  t: any;
}

export default function ServiceHero({ t }: ServiceHeroProps) {
  const stats = [
    { icon: Car, value: '50+', label: t.carsInFleet || 'Avtomobil' },
    { icon: Shield, value: '100%', label: t.insured || 'Sığortalı' },
    { icon: Clock, value: '24/7', label: t.support || 'Dəstək' },
    { icon: MapPin, value: '3+', label: t.locations || 'Məkan' }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-gold/10 via-white to-brand-gold/5 dark:from-brand-dark dark:via-zinc-900 dark:to-brand-dark py-20">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            {t.ourServices || 'Xidmətlərimiz'}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t.servicesDescription || 'Avtomobil icarəsi sahəsində ən yaxşı xidmətləri təqdim edirik'}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(({ icon: Icon, value, label }, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-gold/10 rounded-2xl mb-4">
                <Icon className="w-8 h-8 text-brand-gold" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{value}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}