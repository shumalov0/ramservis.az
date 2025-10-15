'use client';

import { Check, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface PricingSectionProps {
  t: any;
}

export default function PricingSection({ t }: PricingSectionProps) {
  const pricingPlans = [
    {
      name: t.daily || 'Günlük',
      period: t.perDay || 'gün',
      price: '25',
      popular: false,
      features: [
        t.unlimitedKm || 'Limitsiz kilometr',
        t.basicInsurance || 'Əsas sığorta',
        t.freeDelivery || 'Pulsuz çatdırılma',
        t.support24 || '24/7 dəstək'
      ]
    },
    {
      name: t.weekly || 'Həftəlik',
      period: t.perWeek || 'həftə',
      price: '150',
      popular: true,
      features: [
        t.unlimitedKm || 'Limitsiz kilometr',
        t.fullInsurance || 'Tam sığorta',
        t.freeDelivery || 'Pulsuz çatdırılma',
        t.support24 || '24/7 dəstək',
        t.freeDriver || 'Pulsuz sürücü (8 saat)',
        t.carWash || 'Avtomobil yuyulması'
      ]
    },
    {
      name: t.monthly || 'Aylıq',
      period: t.perMonth || 'ay',
      price: '500',
      popular: false,
      features: [
        t.unlimitedKm || 'Limitsiz kilometr',
        t.premiumInsurance || 'Premium sığorta',
        t.freeDelivery || 'Pulsuz çatdırılma',
        t.support24 || '24/7 dəstək',
        t.freeDriver || 'Pulsuz sürücü',
        t.carWash || 'Avtomobil yuyulması',
        t.maintenance || 'Texniki xidmət',
        t.replacement || 'Ehtiyat avtomobil'
      ]
    }
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-zinc-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t.pricingPlans || 'Qiymət Paketləri'}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t.pricingDescription || 'Ehtiyacınıza uyğun ən yaxşı paketi seçin'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-2xl border p-8 ${
                plan.popular
                  ? 'border-brand-gold bg-white dark:bg-zinc-900 shadow-xl scale-105'
                  : 'border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="inline-flex items-center px-4 py-2 bg-brand-gold text-white text-sm font-medium rounded-full">
                    <Star className="w-4 h-4 mr-1" />
                    {t.mostPopular || 'Ən Populyar'}
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    ${plan.price}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 ml-2">
                    / {plan.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center">
                    <Check className="w-5 h-5 text-brand-gold mr-3 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/cars"
                className={`w-full py-3 px-6 rounded-xl font-medium transition-colors duration-200 text-center block ${
                  plan.popular
                    ? 'bg-brand-gold text-white hover:bg-brand-gold/90'
                    : 'bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-zinc-700'
                }`}
              >
                {t.selectPlan || 'Paketi Seç'}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}