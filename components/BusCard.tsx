"use client";
import { FC } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Bus } from "lucide-react";
import { Translation } from "@/lib/translations";

interface BusCardProps {
  bus: {
    name: string;
    capacity: string;
    features: string[];
    image: string;
    pricePerDay: string;
  };
  t: Translation;
  currentLang: string;
}

const BusCard: FC<BusCardProps> = ({ bus, t, currentLang }) => {
  return (
    <Card className="rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-slate-700 w-full cursor-pointer hover:shadow-xl transition-shadow duration-300">
      {/* Image section */}
      <div className="aspect-[4/3] relative overflow-hidden imageParent w-full">
        <div className="w-full h-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
          <Bus className="w-20 h-20 text-white" />
        </div>
        {/* Badge */}
        <div className="absolute top-4 right-4">
          <Badge
            variant="secondary"
            className="bg-white text-blue-600 px-[12px] py-[3px] rounded-[4px] text-[12px]"
          >
            {bus.capacity}
          </Badge>
        </div>
      </div>

      {/* Info section */}
      <div className="bg-white dark:bg-brand-dark rounded-3xl p-6 px-10 info">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {bus.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-[5px] pt-1">
          <Image
            src="/icons/location.svg"
            alt="location"
            height={10}
            width={10}
          />
          <span>27A Ahmed Racabli Baku Narimanov</span>
        </p>

        {/* Separator line */}
        <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

        <div>
          {/* Features list */}
          <div className="space-y-2 mb-4">
            {bus.features.slice(0, 4).map((feature, index) => (
              <div key={index} className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <Star className="w-4 h-4 text-yellow-500 mr-2 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center py-7 font-semibold justify-between">
            <h6 className="carPrice text-[24px]">
              {bus.pricePerDay}₼{" "}
              <span className="text-[16px] font-light">/gün</span>
            </h6>
            <Button
              className="bg-brand-gold hover:bg-brand-gold/90 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transform transition-all duration-200"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Create WhatsApp message with bus details
                const message = currentLang === 'az' ? 
                  `🚌 *Avtobus Sifarişi*

📋 *Avtobus Məlumatları:*
🚐 Model: ${bus.name}
👥 Tutum: ${bus.capacity}
💰 Günlük qiymət: ${bus.pricePerDay}₼

✨ *Xüsusiyyətlər:*
${bus.features.slice(0, 4).map(feature => `• ${feature}`).join('\n')}

Zəhmət olmasa bu avtobus haqqında ətraflı məlumat verin və rezervasiya şərtlərini bildirin.

Təşəkkürlər! 🙏` :
                  currentLang === 'en' ?
                  `🚌 *Bus Order*

📋 *Bus Details:*
🚐 Model: ${bus.name}
👥 Capacity: ${bus.capacity}
💰 Daily price: ${bus.pricePerDay}₼

✨ *Features:*
${bus.features.slice(0, 4).map(feature => `• ${feature}`).join('\n')}

Please provide detailed information about this bus and reservation conditions.

Thank you! 🙏` :
                  currentLang === 'ru' ?
                  `🚌 *Заказ автобуса*

📋 *Детали автобуса:*
🚐 Модель: ${bus.name}
👥 Вместимость: ${bus.capacity}
💰 Цена за день: ${bus.pricePerDay}₼

✨ *Особенности:*
${bus.features.slice(0, 4).map(feature => `• ${feature}`).join('\n')}

Пожалуйста, предоставьте подробную информацию об этом автобусе и условиях бронирования.

Спасибо! 🙏` :
                  `🚌 *طلب حافلة*

📋 *تفاصيل الحافلة:*
🚐 الطراز: ${bus.name}
👥 السعة: ${bus.capacity}
💰 السعر اليومي: ${bus.pricePerDay}₼

✨ *المميزات:*
${bus.features.slice(0, 4).map(feature => `• ${feature}`).join('\n')}

يرجى تقديم معلومات مفصلة عن هذه الحافلة وشروط الحجز.

شكراً لك! 🙏`;

                // Encode message for WhatsApp URL
                const encodedMessage = encodeURIComponent(message);
                const whatsappUrl = `https://wa.me/994707004444?text=${encodedMessage}`;
                
                // Open WhatsApp
                window.open(whatsappUrl, '_blank');
              }}
            >
              {currentLang === "az"
                ? "Sifariş Et"
                : currentLang === "en"
                ? "Book Now"
                : currentLang === "ru"
                ? "Забронировать"
                : "احجز الآن"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BusCard;