'use client';

import { useState, useEffect, Suspense } from 'react';
import FixedHeader from '@/components/FixedHeader';
import Footer from '@/components/Footer';
import GoogleMapIframe from '@/components/GoogleMapIframe';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useTranslation } from '@/lib/translations';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

export default function ContactPage() {
  const [currentLang, setCurrentLang] = useState('az');
  const t = useTranslation(currentLang);



  const contactInfo = {
    address: process.env.NEXT_PUBLIC_COMPANY_ADDRESS || 'Bakı şəhəri, Nəsimi rayonu, Azadlıq prospekti 123',
    phone: process.env.NEXT_PUBLIC_COMPANY_PHONE || '+994707004444',
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+994707004444',
    email: process.env.BUSINESS_EMAIL || 'info@ramservis.az',
    hours: t.workingHours24
  };

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
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-gray-50 dark:from-zinc-800 dark:bg-brand-dark/70 transition-colors duration-300">
      <FixedHeader
        currentLang={currentLang}
        handleLanguageChange={handleLanguageChange}
        t={t}
      />

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-r from-[#f5b754] to-yellow-500">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t.contactTitle}
            </h1>
            <p className="text-xl text-yellow-100 max-w-2xl mx-auto">
              {t.contactSubtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                {t.contactInfo}
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-[#f5b754] dark:text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {t.address}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {contactInfo.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-[#f5b754] dark:text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {t.phone}
                    </h3>
                    <a 
                      href={`tel:${contactInfo.phone}`}
                      className="text-[#f5b754] hover:text-yellow-400 font-medium"
                    >
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-[#f5b754] dark:text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {t.email}
                    </h3>
                    <a 
                      href={`mailto:${contactInfo.email}`}
                      className="text-[#f5b754] hover:text-yellow-400 font-medium"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-[#f5b754] dark:text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {t.workingHours}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {contactInfo.hours}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Contact Buttons */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {t.quickContact}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <a
                    href={`tel:${contactInfo.phone}`}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-[#f5b754] text-black rounded-lg hover:bg-yellow-400 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    {t.callNow}
                  </a>
                  <a
                    href={`https://wa.me/${contactInfo.whatsapp.replace('+', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    {t.whatsappNow}
                  </a>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    {t.emailNow}
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  {t.sendMessage}
                </h2>

                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t.name}
                    </label>
                    <input
                      type="text"
                      placeholder={t.namePlaceholder}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#f5b754] focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t.email}
                    </label>
                    <input
                      type="email"
                      placeholder={t.emailPlaceholder}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#f5b754] focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t.subject}
                    </label>
                    <input
                      type="text"
                      placeholder={t.subjectPlaceholder}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#f5b754] focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t.message}
                    </label>
                    <textarea
                      rows={6}
                      placeholder={t.messagePlaceholder}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#f5b754] focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#f5b754] text-black rounded-lg hover:bg-yellow-400 transition-colors font-medium"
                  >
                    <Send className="w-4 h-4" />
                    {t.send}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <Suspense fallback={<div className="py-16"><LoadingSpinner /></div>}>
        <GoogleMapIframe currentLang={currentLang} />
      </Suspense>

      <Footer t={t} />
    </div>
  );
}