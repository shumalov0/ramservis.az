'use client';

import React, { useState, useEffect, memo, useCallback } from 'react';
import { Translation } from '@/lib/translations';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  currentLang: string;
  t: Translation;
  position?: 'bottom-right' | 'bottom-left';
  showOnMobile?: boolean;
  contextualMessage?: string;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = memo(function WhatsAppButton({
  phoneNumber = '+994707004444', // Default Ram Servis phone number
  currentLang,
  t,
  position = 'bottom-right',
  showOnMobile = true,
  contextualMessage
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Show button after a short delay to avoid layout shift
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Default messages in different languages - memoized for performance
  const getDefaultMessage = useCallback(() => {
    const messages = {
      az: `Salam! Ram Servis maşın icarəsi xidməti ilə əlaqə saxlamaq istəyirəm. Kömək edə bilərsinizmi?`,
      en: `Hello! I would like to contact Ram Servis car rental service. Can you help me?`,
      ru: `Здравствуйте! Я хотел бы связаться с службой аренды автомобилей Ram Servis. Можете ли вы мне помочь?`,
      ar: `مرحبا! أود التواصل مع خدمة تأجير السيارات Ram Servis. هل يمكنكم مساعدتي؟`
    };
    return messages[currentLang as keyof typeof messages] || messages.az;
  }, [currentLang]);

  const handleWhatsAppClick = useCallback(() => {
    const message = contextualMessage || getDefaultMessage();
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
    
    // Open in new window/tab
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  }, [phoneNumber, contextualMessage, getDefaultMessage]);

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6'
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed ${positionClasses[position]} z-50 ${!showOnMobile ? 'hidden md:block' : ''}`}>
      {/* Tooltip */}
      {showTooltip && (
        <div className={`absolute bottom-full mb-2 ${position === 'bottom-right' ? 'right-0' : 'left-0'} 
          bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap
          before:content-[''] before:absolute before:top-full before:${position === 'bottom-right' ? 'right-4' : 'left-4'} 
          before:border-4 before:border-transparent before:border-t-gray-900
          animate-in fade-in-0 zoom-in-95 duration-200`}>
          {t.whatsappContact || 'WhatsApp ilə Əlaqə'}
        </div>
      )}

      {/* WhatsApp Button */}
      <button
        onClick={handleWhatsAppClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="group relative bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg 
          hover:shadow-xl transform hover:scale-110 transition-all duration-300 ease-out
          focus:outline-none focus:ring-4 focus:ring-green-500/30
          animate-in fade-in-0 zoom-in-95 duration-500"
        aria-label={t.whatsappContact || 'WhatsApp Contact'}
      >
        {/* Pulse animation ring */}
        <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20"></div>
        
        {/* WhatsApp Logo */}
        <svg 
          className="h-6 w-6 relative z-10" 
          viewBox="0 0 24 24" 
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
        
        {/* Online indicator */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white
          animate-pulse"></div>
      </button>

      {/* Mobile-specific styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .group {
            padding: 12px;
          }
          .group svg {
            width: 20px;
            height: 20px;
          }
        }
      `}</style>
    </div>
  );
});

export default WhatsAppButton;