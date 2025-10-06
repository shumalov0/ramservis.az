'use client';

import React, { useState, useEffect, memo, useCallback } from 'react';
import { MessageCircle, X } from 'lucide-react';
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
  phoneNumber = '+994708559001', // Default Ram Servis phone number
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
        
        {/* WhatsApp Icon */}
        <MessageCircle className="h-6 w-6 relative z-10" />
        
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