'use client';

import { useState, useEffect } from 'react';
import FixedHeader from '@/components/FixedHeader';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useTranslation } from '@/lib/translations';
import { Bus, Users, MapPin, Clock, Shield, Star, Phone, Mail } from 'lucide-react';
import BusCard from '@/components/BusCard';
import BusesSection from '@/components/BusesSection';
import { buses } from '@/lib/data';

export default function BusPage() {
  const [currentLang, setCurrentLang] = useState('az');
  const t = useTranslation(currentLang);
  
  // Form state
  const [formData, setFormData] = useState({
    passengerCount: '',
    tripType: '',
    tripDate: ''
  });

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

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission and send to WhatsApp
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.passengerCount || !formData.tripType || !formData.tripDate) {
      alert(currentLang === 'az' ? 'Zəhmət olmasa bütün sahələri doldurun' : 
            currentLang === 'en' ? 'Please fill in all fields' :
            currentLang === 'ru' ? 'Пожалуйста, заполните все поля' :
            'يرجى ملء جميع الحقول');
      return;
    }

    // Get localized labels
    const getLocalizedTripType = (type: string) => {
      const tripTypes: Record<string, Record<string, string>> = {
        'city': { az: 'Şəhərdaxili', en: 'City', ru: 'Городской', ar: 'داخل المدينة' },
        'intercity': { az: 'Şəhərlərarası', en: 'Intercity', ru: 'Междугородний', ar: 'بين المدن' },
        'tour': { az: 'Tur', en: 'Tour', ru: 'Тур', ar: 'جولة سياحية' },
        'airport': { az: 'Hava Limanı', en: 'Airport', ru: 'Аэропорт', ar: 'المطار' }
      };
      return tripTypes[type]?.[currentLang] || type;
    };

    // Create WhatsApp message
    const message = currentLang === 'az' ? 
      `🚌 *Avtobus Qiymət Təklifi Sorğusu*

📊 *Məlumatlar:*
👥 Sərnişin sayı: ${formData.passengerCount}
🚗 Səyahət növü: ${getLocalizedTripType(formData.tripType)}
📅 Səyahət tarixi: ${formData.tripDate}

Zəhmət olmasa bu məlumatlar əsasında qiymət təklifi göndərin.

Təşəkkürlər! 🙏` :
      currentLang === 'en' ?
      `🚌 *Bus Quote Request*

📊 *Details:*
👥 Passenger count: ${formData.passengerCount}
🚗 Trip type: ${getLocalizedTripType(formData.tripType)}
📅 Trip date: ${formData.tripDate}

Please send a quote based on this information.

Thank you! 🙏` :
      currentLang === 'ru' ?
      `🚌 *Запрос предложения по автобусу*

📊 *Детали:*
👥 Количество пассажиров: ${formData.passengerCount}
🚗 Тип поездки: ${getLocalizedTripType(formData.tripType)}
📅 Дата поездки: ${formData.tripDate}

Пожалуйста, отправьте предложение на основе этой информации.

Спасибо! 🙏` :
      `🚌 *طلب عرض سعر للحافلة*

📊 *التفاصيل:*
👥 عدد الركاب: ${formData.passengerCount}
🚗 نوع الرحلة: ${getLocalizedTripType(formData.tripType)}
📅 تاريخ الرحلة: ${formData.tripDate}

يرجى إرسال عرض سعر بناءً على هذه المعلومات.

شكراً لك! 🙏`;

    // Encode message for WhatsApp URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/994707004444?text=${encodedMessage}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
  };

  const busServices = [
    {
      icon: <Users className="w-8 h-8" />,
      title: t.passengerTransport || 'Sərnişin Daşıma',
      description: t.passengerTransportDesc || 'Komfortlu avtobuslarımızla şəhərdaxili və şəhərlərarası sərnişin daşıma xidməti'
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: t.tourServices || 'Tur Xidmətləri',
      description: t.tourServicesDesc || 'Turist qrupları üçün xüsusi tur avtobusları və bələdçi xidməti'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: t.corporateTransport || 'Korporativ Nəqliyyat',
      description: t.corporateTransportDesc || 'Şirkətlər üçün işçi daşıma və korporativ tədbir avtobusları'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: t.airportTransfer || 'Hava Limanı Transferi',
      description: t.airportTransferDesc || 'Hava limanına və hava limanından qrup transferi xidməti'
    }
  ];

  const busFleet = [
    {
      name: 'Mercedes Sprinter',
      capacity: '19 nəfər',
      features: ['Kondisioner', 'Wi-Fi', 'USB Şarj', 'Komfortlu Oturacaqlar'],
      image: '/buses/sprinter.jpg',
      pricePerDay: '150'
    },
    {
      name: 'Mercedes Tourismo',
      capacity: '49 nəfər',
      features: ['Kondisioner', 'Wi-Fi', 'WC', 'Mətbəx', 'TV/DVD'],
      image: '/buses/tourismo.jpg',
      pricePerDay: '300'
    },
    {
      name: 'Iveco Daily',
      capacity: '25 nəfər',
      features: ['Kondisioner', 'USB Şarj', 'Komfortlu Oturacaqlar'],
      image: '/buses/iveco.jpg',
      pricePerDay: '180'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 transition-colors duration-300">
      <FixedHeader
        currentLang={currentLang}
        handleLanguageChange={handleLanguageChange}
        t={t}
      />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-white dark:bg-zinc-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Bus className="w-16 h-16 text-brand-gold" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              {t.busServices || 'Avtobus Xidmətləri'}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t.busServicesSubtitle || 'Komfortlu və təhlükəsiz avtobus xidmətləri ilə qrup səyahətlərinizi təşkil edin'}
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50 dark:bg-zinc-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t.ourBusServices || 'Avtobus Xidmətlərimiz'}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t.busServicesDescription || 'Müxtəlif ehtiyaclarınız üçün geniş avtobus xidmətləri təklif edirik'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {busServices.map((service, index) => (
              <div key={index} className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="text-brand-gold mb-4">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fleet Section */}
      <section className="py-16 bg-white dark:bg-zinc-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t.ourBusFleet || 'Avtobus Parkımız'}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t.busFleetDescription || 'Müxtəlif ölçülərdə və komfort səviyyələrində avtobuslarımız'}
            </p>
          </div>

          <BusesSection
            buses={buses.slice(0, 6)}
            t={t}
            currentLang={currentLang}
            getLocalizedBusType={(type: string) => type}
            getLocalizedFuelType={(fuelType: string) => fuelType}
            getLocalizedTransmission={(transmission: string) => transmission}
            showViewAllButton={true}
            showTitle={false}
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-zinc-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                {t.whyChooseOurBuses || 'Niyə Bizim Avtobusları Seçməlisiniz?'}
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-brand-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {t.safetyFirst || 'Təhlükəsizlik Prioriteti'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t.safetyFirstDesc || 'Bütün avtobuslarımız müntəzəm texniki yoxlamadan keçir və təhlükəsizlik standartlarına uyğundur'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-brand-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {t.experiencedDrivers || 'Təcrübəli Sürücülər'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t.experiencedDriversDesc || 'Peşəkar və təcrübəli sürücülərimiz sizin səyahətinizi təhlükəsiz edir'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-brand-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {t.punctuality || 'Vaxtında Xidmət'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t.punctualityDesc || 'Vaxtınıza hörmət edirik və həmişə vaxtında xidmət göstəririk'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-brand-gold to-yellow-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">
                {t.getQuote || 'Qiymət Təklifi Alın'}
              </h3>
              <form className="space-y-4" onSubmit={handleFormSubmit}>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t.passengerCount || 'Sərnişin Sayı'}
                  </label>
                  <select 
                    name="passengerCount"
                    value={formData.passengerCount}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                  >
                    <option value="" className="text-gray-800">
                      {currentLang === 'az' ? 'Seçin' : 
                       currentLang === 'en' ? 'Select' :
                       currentLang === 'ru' ? 'Выберите' : 'اختر'}
                    </option>
                    <option value="1-19" className="text-gray-800">1-19 {currentLang === 'az' ? 'nəfər' : currentLang === 'en' ? 'people' : currentLang === 'ru' ? 'человек' : 'شخص'}</option>
                    <option value="20-35" className="text-gray-800">20-35 {currentLang === 'az' ? 'nəfər' : currentLang === 'en' ? 'people' : currentLang === 'ru' ? 'человек' : 'شخص'}</option>
                    <option value="36-49" className="text-gray-800">36-49 {currentLang === 'az' ? 'nəfər' : currentLang === 'en' ? 'people' : currentLang === 'ru' ? 'человек' : 'شخص'}</option>
                    <option value="50+" className="text-gray-800">50+ {currentLang === 'az' ? 'nəfər' : currentLang === 'en' ? 'people' : currentLang === 'ru' ? 'человек' : 'شخص'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t.tripType || 'Səyahət Növü'}
                  </label>
                  <select 
                    name="tripType"
                    value={formData.tripType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                  >
                    <option value="" className="text-gray-800">
                      {currentLang === 'az' ? 'Seçin' : 
                       currentLang === 'en' ? 'Select' :
                       currentLang === 'ru' ? 'Выберите' : 'اختر'}
                    </option>
                    <option value="city" className="text-gray-800">
                      {currentLang === 'az' ? 'Şəhərdaxili' : 
                       currentLang === 'en' ? 'City' :
                       currentLang === 'ru' ? 'Городской' : 'داخل المدينة'}
                    </option>
                    <option value="intercity" className="text-gray-800">
                      {currentLang === 'az' ? 'Şəhərlərarası' : 
                       currentLang === 'en' ? 'Intercity' :
                       currentLang === 'ru' ? 'Междугородний' : 'بين المدن'}
                    </option>
                    <option value="tour" className="text-gray-800">
                      {currentLang === 'az' ? 'Tur' : 
                       currentLang === 'en' ? 'Tour' :
                       currentLang === 'ru' ? 'Тур' : 'جولة سياحية'}
                    </option>
                    <option value="airport" className="text-gray-800">
                      {currentLang === 'az' ? 'Hava Limanı' : 
                       currentLang === 'en' ? 'Airport' :
                       currentLang === 'ru' ? 'Аэропорт' : 'المطار'}
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t.tripDate || 'Səyahət Tarixi'}
                  </label>
                  <input
                    type="date"
                    name="tripDate"
                    value={formData.tripDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-white text-brand-gold rounded-lg hover:bg-gray-100 transition-colors font-medium hover:scale-105 transform duration-200"
                >
                  {t.getQuoteButton || 'Qiymət Təklifi Al'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white dark:bg-zinc-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t.contactForBusService || 'Avtobus Xidməti üçün Əlaqə'}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t.contactForBusServiceDesc || 'Avtobus sifarişi vermək və ya ətraflı məlumat almaq üçün bizimlə əlaqə saxlayın'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <a
              href="tel:+994707004444"
              className="flex items-center gap-4 p-6 bg-white dark:bg-zinc-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                <Phone className="w-6 h-6 text-brand-gold" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {t.busCallUs || 'Bizə Zəng Edin'}
                </h3>
                <div className="space-y-1">
                  <p className="text-brand-gold font-medium">+994 70 700 44 44</p>
                  <p className="text-brand-gold font-medium">+994 70 246 46 01</p>
                  <p className="text-brand-gold font-medium">+994 12 511 32 44</p>
                </div>
              </div>
            </a>

            <a
              href="https://wa.me/994707004444"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-6 bg-white dark:bg-zinc-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {t.busWhatsappUs || 'WhatsApp Yazın'}
                </h3>
                <div className="space-y-1">
                  <p className="text-green-600 dark:text-green-400 font-medium">+994 70 700 44 44</p>
                  <p className="text-green-600 dark:text-green-400 font-medium">+994 70 246 46 01</p>
                  <p className="text-green-600 dark:text-green-400 font-medium">+994 12 511 32 44</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      <Footer t={t} />
    </div>
  );
}