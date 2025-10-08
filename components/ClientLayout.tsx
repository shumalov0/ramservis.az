'use client';

import React, { useState, useEffect } from 'react';
import WhatsAppButton from './WhatsAppButton';
import { useTranslation } from '@/lib/translations';
import { usePathname } from 'next/navigation';
// Removed animation imports for better performance

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const [currentLang, setCurrentLang] = useState('az');
  const t = useTranslation(currentLang);
  const pathname = usePathname();

  // Removed animation hooks for better performance

  useEffect(() => {
    const savedLang = localStorage.getItem('ramservis_language');
    if (savedLang && ['az', 'en', 'ru', 'ar'].includes(savedLang)) {
      setCurrentLang(savedLang);
    }
  }, []);

  // Context-aware messaging based on current page
  const getContextualMessage = () => {
    const baseMessages = {
      az: 'Salam! Ram Servis maşın icarəsi xidməti ilə əlaqə saxlamaq istəyirəm.',
      en: 'Hello! I would like to contact Ram Servis car rental service.',
      ru: 'Здравствуйте! Я хотел бы связаться с службой аренды автомобилей Ram Servis.',
      ar: 'مرحبا! أود التواصل مع خدمة تأجير السيارات Ram Servis.'
    };

    const contextMessages = {
      az: {
        '/': 'Salam! Ana səhifədən yazıram. Maşın icarəsi haqqında məlumat almaq istəyirəm.',
        '/cars': 'Salam! Maşınlar səhifəsindən yazıram. Mövcud maşınlar haqqında məlumat almaq istəyirəm.',
        '/booking': 'Salam! Rezervasiya etmək istəyirəm. Kömək edə bilərsinizmi?',
        '/about': 'Salam! Şirkətiniz haqqında əlavə məlumat almaq istəyirəm.',
        '/contact': 'Salam! Əlaqə səhifəsindən yazıram. Sizinlə əlaqə saxlamaq istəyirəm.',
        '/services': 'Salam! Xidmətləriniz haqqında məlumat almaq istəyirəm.'
      },
      en: {
        '/': 'Hello! I am writing from the homepage. I would like to get information about car rental.',
        '/cars': 'Hello! I am writing from the cars page. I would like to get information about available cars.',
        '/booking': 'Hello! I would like to make a reservation. Can you help me?',
        '/about': 'Hello! I would like to get additional information about your company.',
        '/contact': 'Hello! I am writing from the contact page. I would like to get in touch with you.',
        '/services': 'Hello! I would like to get information about your services.'
      },
      ru: {
        '/': 'Здравствуйте! Пишу с главной страницы. Хотел бы получить информацию об аренде автомобилей.',
        '/cars': 'Здравствуйте! Пишу со страницы автомобилей. Хотел бы получить информацию о доступных машинах.',
        '/booking': 'Здравствуйте! Хотел бы сделать бронирование. Можете ли вы помочь?',
        '/about': 'Здравствуйте! Хотел бы получить дополнительную информацию о вашей компании.',
        '/contact': 'Здравствуйте! Пишу со страницы контактов. Хотел бы связаться с вами.',
        '/services': 'Здравствуйте! Хотел бы получить информацию о ваших услугах.'
      },
      ar: {
        '/': 'مرحبا! أكتب من الصفحة الرئيسية. أود الحصول على معلومات حول تأجير السيارات.',
        '/cars': 'مرحبا! أكتب من صفحة السيارات. أود الحصول على معلومات حول السيارات المتاحة.',
        '/booking': 'مرحبا! أود إجراء حجز. هل يمكنكم مساعدتي؟',
        '/about': 'مرحبا! أود الحصول على معلومات إضافية حول شركتكم.',
        '/contact': 'مرحبا! أكتب من صفحة الاتصال. أود التواصل معكم.',
        '/services': 'مرحبا! أود الحصول على معلومات حول خدماتكم.'
      }
    };

    const langMessages = contextMessages[currentLang as keyof typeof contextMessages];
    if (langMessages && langMessages[pathname as keyof typeof langMessages]) {
      return langMessages[pathname as keyof typeof langMessages];
    }

    // Check for dynamic routes (like /car/[id])
    if (pathname.startsWith('/car/')) {
      const dynamicMessages = {
        az: 'Salam! Maşın detalları səhifəsindən yazıram. Bu maşın haqqında məlumat almaq istəyirəm.',
        en: 'Hello! I am writing from the car details page. I would like to get information about this car.',
        ru: 'Здравствуйте! Пишу со страницы деталей автомобиля. Хотел бы получить информацию об этой машине.',
        ar: 'مرحبا! أكتب من صفحة تفاصيل السيارة. أود الحصول على معلومات حول هذه السيارة.'
      };
      return dynamicMessages[currentLang as keyof typeof dynamicMessages];
    }

    return baseMessages[currentLang as keyof typeof baseMessages] || baseMessages.az;
  };

  return (
    <>
      {children}
      <WhatsAppButton
        phoneNumber="+994707004444"
        currentLang={currentLang}
        t={t}
        position="bottom-right"
        showOnMobile={true}
        contextualMessage={getContextualMessage()}
      />
    </>
  );
};

export default ClientLayout;