"use client";
import { FC } from "react";
import { Translation } from "@/lib/translations";
import { Calendar, Car, MapPin } from "lucide-react";

interface HeroSectionProps {
  t: Translation;
}

const Advanced:FC<HeroSectionProps> = ({ t }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 px-6 ">
      <div className="flex flex-col items-center p-6 bg-white/90 dark:bg-brand-dark/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-[#2a2a2a]/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
        <span className="h-12 w-12 text-brand-gold dark:text-brand-gold mb-4">
          📅
        </span>
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
          {t.flexibleBooking}
        </h3>
        <p className="text-gray-700 dark:text-gray-300 text-center">
          {t.flexibleBookingDesc}
        </p>
      </div>
      <div className="flex flex-col items-center p-6 bg-white/90 dark:bg-brand-dark/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-[#2a2a2a]/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
        <span className="h-12 w-12 text-brand-gold dark:text-brand-gold mb-4">
          🚗
        </span>
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
          {t.varietyChoice}
        </h3>
        <p className="text-gray-700 dark:text-gray-300 text-center">
          {t.varietyChoiceDesc}
        </p>
      </div>
      <div className="flex flex-col items-center p-6 bg-white/90 dark:bg-brand-dark/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-[#2a2a2a]/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
        <span className="h-12 w-12 text-brand-gold dark:text-brand-gold mb-4">
          📍
        </span>
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
          {t.deliveryService}
        </h3>
        <p className="text-gray-700 dark:text-gray-300 text-center">
          {t.deliveryServiceDesc}
        </p>
      </div>
    </div>
  );
};

export default Advanced;
