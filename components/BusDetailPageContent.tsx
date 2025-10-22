'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import FixedHeader from '@/components/FixedHeader';
import Footer from '@/components/Footer';
import { Bus, EnhancedBus } from '@/lib/types';
import { useTranslation } from '@/lib/translations';
import { 
  Users, 
  Fuel, 
  Settings, 
  Calendar, 
  Shield, 
  Star, 
  ArrowLeft,
  Phone,
  MessageCircle,
  CheckCircle,
  MapPin,
  Clock,
  Wifi,
  Coffee
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import BookingModal from '@/components/BookingModal';
import BusesSection from '@/components/BusesSection';
import { buses } from '@/lib/data';

interface BusDetailPageContentProps {
  bus: Bus;
  enhancedBus: EnhancedBus;
  initialLang: string;
}

export default function BusDetailPageContent({ bus, enhancedBus, initialLang }: BusDetailPageContentProps) {
  const [currentLang, setCurrentLang] = useState(initialLang);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const router = useRouter();
  const t = useTranslation(currentLang);

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

  const handleBookNow = () => {
    setIsBookingModalOpen(true);
  };

  const handleWhatsApp = () => {
    const message = `Salam! ${bus.brand} ${bus.model} ${bus.year} avtobusu haqqında məlumat almaq istəyirəm. Günlük qiymət: ${bus.dailyPrice}₼`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/994707004444?text=${encodedMessage}`, '_blank');
  };

  const handleCall = () => {
    window.open('tel:+994707004444', '_self');
  };

  // Get other buses for recommendations
  const otherBuses = buses.filter(b => b.id !== bus.id).slice(0, 3);

  const getLocalizedBusType = (type: string) => {
    const typeMap: Record<string, Record<string, string>> = {
      'Minibus': { az: 'Minibus', en: 'Minibus', ru: 'Минибус' },
      'Coach': { az: 'Avtobus', en: 'Coach', ru: 'Автобус' },
      'Tour Bus': { az: 'Tur Avtobusu', en: 'Tour Bus', ru: 'Туристический автобус' },
    };
    return typeMap[type]?.[currentLang] || type;
  };

  const getLocalizedFuelType = (fuelType: string) => {
    const fuelMap: Record<string, Record<string, string>> = {
      'Benzin': { az: 'Benzin', en: 'Gasoline', ru: 'Бензин' },
      'Dizel': { az: 'Dizel', en: 'Diesel', ru: 'Дизель' },
    };
    return fuelMap[fuelType]?.[currentLang] || fuelType;
  };

  const getLocalizedTransmission = (transmission: string) => {
    const transmissionMap: Record<string, Record<string, string>> = {
      'Avtomat': { az: 'Avtomat', en: 'Automatic', ru: 'Автомат' },
      'Mexaniki': { az: 'Mexaniki', en: 'Manual', ru: 'Механика' },
    };
    return transmissionMap[transmission]?.[currentLang] || transmission;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900">
      <FixedHeader
        currentLang={currentLang}
        handleLanguageChange={handleLanguageChange}
        t={t}
      />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-brand-gold mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{currentLang === 'az' ? 'Geri' : currentLang === 'en' ? 'Back' : currentLang === 'ru' ? 'Назад' : 'العودة'}</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-[4/3] relative overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800">
                <Image
                  src={enhancedBus.gallery[selectedImageIndex] || bus.image}
                  alt={`${bus.brand} ${bus.model}`}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Thumbnail Gallery */}
              {enhancedBus.gallery.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {enhancedBus.gallery.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-square relative overflow-hidden rounded-lg ${
                        selectedImageIndex === index
                          ? 'ring-2 ring-brand-gold'
                          : 'hover:opacity-80'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${bus.brand} ${bus.model} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Bus Details */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {bus.brand} {bus.model}
                  </h1>
                  <Badge variant="secondary" className="bg-brand-gold/10 text-brand-gold">
                    {bus.year}
                  </Badge>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  {getLocalizedBusType(bus.type)} • {bus.capacity} nəfərlik
                </p>
              </div>

              {/* Pricing */}
              <Card className="p-6 bg-gradient-to-r from-brand-gold/5 to-yellow-50 dark:from-brand-gold/10 dark:to-yellow-900/20 border-brand-gold/20">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      {bus.dailyPrice}₼
                      <span className="text-lg font-normal text-gray-600 dark:text-gray-400 ml-2">
                        /gün
                      </span>
                    </div>
                    <div className="flex gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>Həftəlik: {bus.weeklyPrice}₼/gün</span>
                      <span>Aylıq: {bus.monthlyPrice}₼/gün</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Depozit</div>
                    <div className="text-xl font-semibold text-gray-900 dark:text-white">
                      {bus.deposit}₼
                    </div>
                  </div>
                </div>
              </Card>

              {/* Quick Specs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Users className="w-6 h-6 text-brand-gold" />
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Tutum</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {bus.capacity} nəfər
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Fuel className="w-6 h-6 text-brand-gold" />
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Yanacaq</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {getLocalizedFuelType(bus.fuelType)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Settings className="w-6 h-6 text-brand-gold" />
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Transmissiya</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {getLocalizedTransmission(bus.transmission)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Calendar className="w-6 h-6 text-brand-gold" />
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">İl</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {bus.year}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleBookNow}
                  className="w-full bg-brand-gold hover:bg-brand-gold/90 text-white py-3 text-lg font-semibold"
                  size="lg"
                >
                  {currentLang === 'az' ? 'İndi Rezerv Et' :
                   currentLang === 'en' ? 'Book Now' :
                   currentLang === 'ru' ? 'Забронировать' :
                   'احجز الآن'}
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={handleWhatsApp}
                    variant="outline"
                    className="flex items-center gap-2 py-3"
                  >
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp
                  </Button>
                  <Button
                    onClick={handleCall}
                    variant="outline"
                    className="flex items-center gap-2 py-3"
                  >
                    <Phone className="w-5 h-5" />
                    {currentLang === 'az' ? 'Zəng Et' :
                     currentLang === 'en' ? 'Call' :
                     currentLang === 'ru' ? 'Звонить' :
                     'اتصل'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              {currentLang === 'az' ? 'Xüsusiyyətlər' :
               currentLang === 'en' ? 'Features' :
               currentLang === 'ru' ? 'Особенности' :
               'المميزات'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bus.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-900 dark:text-white">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Specifications */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              {currentLang === 'az' ? 'Texniki Xüsusiyyətlər' :
               currentLang === 'en' ? 'Specifications' :
               currentLang === 'ru' ? 'Технические характеристики' :
               'المواصفات التقنية'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  {currentLang === 'az' ? 'Mühərrik' :
                   currentLang === 'en' ? 'Engine' :
                   currentLang === 'ru' ? 'Двигатель' :
                   'المحرك'}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Mühərrik:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {enhancedBus.specifications.engine}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Güc:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {enhancedBus.specifications.horsepower} hp
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Yanacaq sərfiyyatı:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {enhancedBus.specifications.fuelConsumption}
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  {currentLang === 'az' ? 'Performans' :
                   currentLang === 'en' ? 'Performance' :
                   currentLang === 'ru' ? 'Производительность' :
                   'الأداء'}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Maksimum sürət:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {enhancedBus.specifications.topSpeed} km/h
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Sürətlənmə:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {enhancedBus.specifications.acceleration}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Tutum:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {bus.capacity} nəfər
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Rental Rules */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              {currentLang === 'az' ? 'İcarə Şərtləri' :
               currentLang === 'en' ? 'Rental Requirements' :
               currentLang === 'ru' ? 'Условия аренды' :
               'شروط الإيجار'}
            </h2>
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-brand-gold" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        Minimum yaş: {bus.rules.minimumAge}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Sürücülük təcrübəsi: {bus.rules.drivingExperience} il
                      </div>
                    </div>
                  </div>
                  
                  {bus.rules.commercialLicense && (
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-900 dark:text-white">
                        Kommersiya sürücülük vəsiqəsi tələb olunur
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-900 dark:text-white">
                      Pasport tələb olunur
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-900 dark:text-white">
                      Sürücülük vəsiqəsi tələb olunur
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Other Buses */}
          {otherBuses.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                {currentLang === 'az' ? 'Digər Avtobuslar' :
                 currentLang === 'en' ? 'Other Buses' :
                 currentLang === 'ru' ? 'Другие автобусы' :
                 'حافلات أخرى'}
              </h2>
              <BusesSection
                buses={otherBuses}
                t={t}
                currentLang={currentLang}
                getLocalizedBusType={getLocalizedBusType}
                getLocalizedFuelType={getLocalizedFuelType}
                getLocalizedTransmission={getLocalizedTransmission}
                showViewAllButton={false}
                showTitle={false}
              />
            </div>
          )}
        </div>
      </div>

      {/* Simple Booking Modal for Buses */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {currentLang === 'az' ? 'Avtobus Rezervasiyası' :
                 currentLang === 'en' ? 'Bus Reservation' :
                 currentLang === 'ru' ? 'Бронирование автобуса' :
                 'حجز الحافلة'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {bus.brand} {bus.model} {bus.year} - {bus.capacity} nəfərlik
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {currentLang === 'az' ? 'Avtobus rezervasiyası üçün bizimlə əlaqə saxlayın' :
                 currentLang === 'en' ? 'Contact us for bus reservation' :
                 currentLang === 'ru' ? 'Свяжитесь с нами для бронирования автобуса' :
                 'اتصل بنا لحجز الحافلة'}
              </p>
              
              <div className="space-y-3">
                <Button
                  onClick={handleWhatsApp}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp
                </Button>
                
                <Button
                  onClick={handleCall}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  {currentLang === 'az' ? 'Zəng Et' :
                   currentLang === 'en' ? 'Call' :
                   currentLang === 'ru' ? 'Звонить' :
                   'اتصل'}
                </Button>
                
                <Button
                  onClick={() => setIsBookingModalOpen(false)}
                  variant="outline"
                  className="w-full"
                >
                  {currentLang === 'az' ? 'Bağla' :
                   currentLang === 'en' ? 'Close' :
                   currentLang === 'ru' ? 'Закрыть' :
                   'إغلاق'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer t={t} />
    </div>
  );
}