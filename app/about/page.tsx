'use client';

import { useState, useEffect } from 'react';
import FixedHeader from '@/components/FixedHeader';
import Footer from '@/components/Footer';
import { useTranslation } from '@/lib/translations';
import { Car, Users, Award, MapPin } from 'lucide-react';
import GoogleReviews from '@/components/GoogleReviews';
import { CertificatesCarousel } from '@/components/CertificatesCarousel';
import { certificates } from '@/lib/data';

export default function AboutPage() {
  const [currentLang, setCurrentLang] = useState('az');
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

  const aboutContent: Record<'az'|'en'|'ru'|'ar', {
    title: string; subtitle: string; mission: string; missionText: string; vision: string; visionText: string; values: string; valuesText: string; experience: string; experienceText: string; fleet: string; fleetText: string; service: string; serviceText: string;
  }> = {
    az: {
      title: "Haqqımızda",
      subtitle: "Peşəkar avtomobil icarəsi xidməti ilə sizin səyahətinizi rahat və təhlükəsiz edirik.",
      mission: "Missiyamız",
      missionText: "Müştərilərimizə yüksək keyfiyyətli avtomobillər və xüsusi dəstək təqdim etməklə, hər səyahəti unudulmaz bir təcrübəyə çevirməkdir.",
      vision: "Vizyonumuz",
      visionText: "Avtomobil icarəsi sahəsində ən yaxşı şirkət olmaq və müştərilərimizə ən yaxşı xidməti təqdim etmək.",
      values: "Dəyərlərimiz",
      valuesText: "Müştəri məmnuniyyəti, etibarlılıq, keyfiyyət və innovasiya bizim əsas dəyərlərimizdir.",
      experience: "Təcrübə",
      experienceText: "10+ il ərzində minlərlə müştəriyə xidmət etdik və onların etibarını qazandıq.",
      fleet: "Avtomobil Parkı",
      fleetText: "Ən müasir avtomobillərdən ibarət geniş flotumuzla hər zaman xidmətinizdəyik.",
      service: "Xidmət",
      serviceText: "7/24 dəstək və çatdırılma xidməti ilə sizin rahatlığınızı təmin edirik.",
    },
    en: {
      title: "About Us",
      subtitle: "We make your travel comfortable and safe with professional car rental service.",
      mission: "Our Mission",
      missionText: "To make every journey an unforgettable experience by providing our customers with high-quality vehicles and special support.",
      vision: "Our Vision",
      visionText: "To be the best company in the car rental industry and provide the best service to our customers.",
      values: "Our Values",
      valuesText: "Customer satisfaction, reliability, quality and innovation are our core values.",
      experience: "Experience",
      experienceText: "We have served thousands of customers and gained their trust over 10+ years.",
      fleet: "Car Fleet",
      fleetText: "With our extensive fleet of modern vehicles, we are always at your service.",
      service: "Service",
      serviceText: "We ensure your comfort with 24/7 support and delivery service.",
    },
    ru: {
      title: "О нас",
      subtitle: "Делаем ваше путешествие комфортным и безопасным с профессиональным сервисом аренды автомобилей.",
      mission: "Наша миссия",
      missionText: "Сделать каждое путешествие незабываемым опытом, предоставляя нашим клиентам высококачественные автомобили и специальную поддержку.",
      vision: "Наше видение",
      visionText: "Стать лучшей компанией в индустрии проката автомобилей и предоставлять лучший сервис нашим клиентам.",
      values: "Наши ценности",
      valuesText: "Удовлетворенность клиентов, надежность, качество и инновации - это наши основные ценности.",
      experience: "Опыт",
      experienceText: "За 10+ лет мы обслужили тысячи клиентов и заслужили их доверие.",
      fleet: "Автопарк",
      fleetText: "С нашим обширным парком современных автомобилей мы всегда к вашим услугам.",
      service: "Сервис",
      serviceText: "Обеспечиваем ваш комфорт с круглосуточной поддержкой и службой доставки.",
    },
    ar: {
      title: "حولنا",
      subtitle: "نجعل سفرك مريحًا وآمنًا مع خدمة تأجير السيارات المهنية.",
      mission: "مهمتنا",
      missionText: "تحويل كل رحلة إلى تجربة لا تُنسى من خلال توفير مركبات عالية الجودة ودعم خاص لعملائنا.",
      vision: "رؤيتنا",
      visionText: "أن نكون أفضل شركة في مجال تأجير السيارات وتقديم أفضل خدمة لعملائنا.",
      values: "قيمنا",
      valuesText: "رضا العملاء والموثوقية والجودة والابتكار هي قيمنا الأساسية.",
      experience: "الخبرة",
      experienceText: "لقد خدمنا آلاف العملاء وكسبنا ثقتهم على مدى 10+ سنوات.",
      fleet: "أسطول السيارات",
      fleetText: "مع أسطولنا الواسع من المركبات الحديثة، نكون دائمًا في خدمتكم.",
      service: "الخدمة",
      serviceText: "نضمن راحتك مع دعم 24/7 وخدمة التوصيل.",
    }
  };

  const content = aboutContent[(currentLang as 'az'|'en'|'ru'|'ar')] || aboutContent.az;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-gray-50 dark:from-zinc-800 dark:bg-brand-dark/70  transition-colors duration-300">
      <FixedHeader currentLang={currentLang} handleLanguageChange={handleLanguageChange} t={t} />
      
      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {content.title}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {content.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div className="bg-white dark:bg-brand-dark/70  rounded-2xl shadow-xl p-8">
              <div className="flex items-center mb-6">
                <div className="bg-amber-100 dark:bg-brand-dark/70  p-3 rounded-full mr-4">
                  <Car className="h-6 w-6 text-brand-gold dark:text-brand-gold" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{content.mission}</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                {content.missionText}
              </p>
            </div>

            <div className="bg-white dark:bg-brand-dark/70  rounded-2xl shadow-xl p-8">
              <div className="flex items-center mb-6">
                <div className="bg-amber-100 dark:bg-brand-dark/70  p-3 rounded-full mr-4">
                  <Award className="h-6 w-6 text-brand-gold dark:text-brand-gold" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{content.vision}</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                {content.visionText}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-brand-dark/70  rounded-2xl shadow-xl p-8 mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
              {content.values}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto">
              {content.valuesText}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white dark:bg-brand-dark/70  rounded-2xl shadow-xl p-8 text-center">
              <div className="bg-amber-100 dark:bg-amber-900/30 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-brand-gold dark:text-brand-gold" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{content.experience}</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {content.experienceText}
              </p>
            </div>

            <div className="bg-white dark:bg-brand-dark/70  rounded-2xl shadow-xl p-8 text-center">
              <div className="bg-amber-100 dark:bg-brand-dark/70  p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Car className="h-8 w-8 text-brand-gold dark:text-brand-gold" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{content.fleet}</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {content.fleetText}
              </p>
            </div>

            <div className="bg-white dark:bg-brand-dark/70 rounded-2xl shadow-xl p-8 text-center">
              <div className="bg-amber-100 dark:bg-brand-dark/70  p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <MapPin className="h-8 w-8 text-brand-gold dark:text-brand-gold" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{content.service}</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {content.serviceText}
              </p>
            </div>
          </div>

          {/* Certificates Section */}
          <div className="bg-white dark:bg-brand-dark/70 rounded-2xl shadow-xl p-8 mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
              {currentLang === 'az' ? 'Sertifikatlarımız və Lisenziyalarımız' :
               currentLang === 'en' ? 'Our Certificates and Licenses' :
               currentLang === 'ru' ? 'Наши сертификаты и лицензии' : 'شهاداتنا وتراخيصنا'}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto mb-8">
              {currentLang === 'az' ? 'Peşəkarlığımızı və keyfiyyətimizi təsdiq edən rəsmi sənədlər' :
               currentLang === 'en' ? 'Official documents confirming our professionalism and quality' :
               currentLang === 'ru' ? 'Официальные документы, подтверждающие наш профессионализм и качество' : 'الوثائق الرسمية التي تؤكد احترافيتنا وجودتنا'}
            </p>
            <CertificatesCarousel
              certificates={certificates}
              autoPlay={false}
              showDots={true}
              currentLang={currentLang}
            />
          </div>
        </div>
      </div>

      {/* Customer Reviews */}
      <GoogleReviews
        maxReviews={4}
        showRating={true}
        currentLang={currentLang}
        className="bg-white dark:bg-brand-dark/70"
      />
      
      <Footer t={t} />
    </div>
  );
}