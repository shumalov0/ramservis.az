'use client';

import { Search, Calendar, CreditCard, Car } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProcessStepsProps {
  t: any;
}

export default function ProcessSteps({ t }: ProcessStepsProps) {
  const steps = [
    {
      icon: Search,
      title: t.selectCar || 'Avtomobil Seçin',
      description: t.selectCarDesc || 'Geniş avtomobil parkımızdan sizə uyğun olanı seçin'
    },
    {
      icon: Calendar,
      title: t.chooseDate || 'Tarix Seçin',
      description: t.chooseDateDesc || 'İcarə müddətini və çatdırılma vaxtını təyin edin'
    },
    {
      icon: CreditCard,
      title: t.makePayment || 'Ödəniş Edin',
      description: t.makePaymentDesc || 'Təhlükəsiz ödəniş sistemimizlə ödənişi tamamlayın'
    },
    {
      icon: Car,
      title: t.enjoyRide || 'Səyahətdən Həzz Alın',
      description: t.enjoyRideDesc || 'Avtomobilinizi təhvil alın və səyahətə başlayın'
    }
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t.howItWorks || 'Necə İşləyir?'}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t.processDescription || 'Sadə 4 addımda avtomobilinizi icarəyə götürün'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative text-center"
            >
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-brand-gold to-gray-200 dark:to-zinc-700 z-0" />
              )}
              
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-gold rounded-2xl mb-6">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white dark:bg-zinc-900 border-2 border-brand-gold rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-brand-gold">{index + 1}</span>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                {step.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}