'use client';

import { Phone, MessageCircle, Mail, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface ContactCTAProps {
  t: any;
}

export default function ContactCTA({ t }: ContactCTAProps) {
  const contactMethods = [
    {
      icon: Phone,
      title: t.callUs || 'Zəng Edin',
      value: '+994 50 123 45 67',
      action: 'tel:+994707004444',
      color: 'bg-brand-gold'
    },
    {
      icon: MessageCircle,
      title: t.whatsapp || 'WhatsApp',
      value: t.quickResponse || 'Sürətli cavab',
      action: 'https://wa.me/994707004444',
      color: 'bg-brand-gold'
    },
    {
      icon: Mail,
      title: t.email || 'Email',
      value: 'info@ramservis.az',
      action: 'mailto:info@ramservis.az',
      color: 'bg-brand-gold'
    },
    {
      icon: MapPin,
      title: t.visitUs || 'Ofisimizə Gəlin',
      value: t.bakuCenter || '27A Ahmed Racabli Baku Narimanov',
      action: 'https://maps.app.goo.gl/KcTdqFwzMBPy9dF26',
      color: 'bg-brand-gold'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-brand-gold/10 via-white to-brand-gold/5 dark:from-brand-dark dark:via-zinc-900 dark:to-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t.readyToStart || 'Başlamağa Hazırsınız?'}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t.contactDescription || 'Bizimlə əlaqə saxlayın və ən yaxşı avtomobil icarəsi xidmətindən yararlanın'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactMethods.map((method, index) => (
            <motion.a
              key={index}
              href={method.action}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group block p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 hover:shadow-lg transition-all duration-300"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 ${method.color} rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <method.icon className="w-6 h-6 text-white" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {method.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400">
                {method.value}
              </p>
            </motion.a>
          ))}
        </div>

        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="inline-flex flex-col sm:flex-row gap-4"
          >
            <Link 
              href="/booking"
              className="px-8 py-4 bg-brand-gold text-white font-semibold rounded-xl hover:bg-brand-gold/90 transition-colors duration-200 text-center"
            >
              {t.bookNow || 'İndi Sifariş Et'}
            </Link>
            <Link 
              href="/cars"
              className="px-8 py-4 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white font-semibold rounded-xl border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors duration-200 text-center"
            >
              {t.viewCars || 'Avtomobilləri Gör'}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}