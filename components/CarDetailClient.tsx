'use client';

import { Button } from '@/components/ui/button';
import { Phone, MessageCircle, CreditCard } from 'lucide-react';
import { Car } from '@/lib/data';
import { useTranslation } from '@/lib/translations';

interface CarDetailClientProps {
  car: Car;
  currentLang: string;
  onShowBookingForm: () => void;
}

export default function CarDetailClient({ car, currentLang, onShowBookingForm }: CarDetailClientProps) {
  const t = useTranslation(currentLang);

  const handleWhatsApp = () => {
    const message = `Salam! ${car.brand} ${car.model} (${car.year}) haqqında məlumat almaq istəyirəm.`;
    const whatsappUrl = `https://wa.me/+994708559001?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handlePhoneCall = () => {
    window.location.href = 'tel:+994708559001';
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{t.contactOptions}</h3>
      
      <Button 
        onClick={handleWhatsApp}
        className="w-full bg-green-600 hover:bg-green-700 text-white h-14 text-lg"
      >
        <MessageCircle className="h-5 w-5 mr-2" />
        {t.whatsappContact}
      </Button>

      <Button 
        onClick={handlePhoneCall}
        variant="outline"
        className="w-full h-14 text-lg border-2 border-brand-gold text-brand-gold hover:bg-amber-50"
      >
        <Phone className="h-5 w-5 mr-2" />
        {t.phoneCall}
      </Button>

      <Button 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onShowBookingForm();
        }}
        className="w-full bg-amber-600 hover:bg-amber-700 text-white h-14 text-lg"
      >
        <CreditCard className="h-5 w-5 mr-2" />
        {t.onlineBooking}
      </Button>
    </div>
  );
}