// // components/HeroSection.tsx
// import { FC } from 'react';
// import { Translation } from '@/lib/translations';
// import { Calendar, Car, MapPin } from 'lucide-react';

// interface HeroSectionProps {
//   t: Translation;
// }

// const HeroSection: FC<HeroSectionProps> = ({ t }) => {
//   return (
//     <section className="relative py-20 px-4 sm:px-6 lg:px-8 min-h-screen flex  items-center">
//       {/* Background Image */}
//       <div className="absolute inset-0 z-0">
//         <img
//           src="/cars/12.jpg"
//           alt="Luxury Car Fleet"
//           className="w-full h-full object-cover"
//         />
//         {/* Dark overlay */}
//         <div className="absolute inset-0 bg-black/50"></div>
//       </div>

//       <div className="max-w-7xl mx-auto text-center relative z-10">
//         <h2 className="text-5xl font-bold text-white dark:text-white mb-6">
//           {t.heroTitle.split(' ').slice(0, -2).join(' ')}{' '}
//           <span className="text-amber-400 dark:text-amber-400">{t.heroTitle.split(' ').slice(-2).join(' ')}</span>
//         </h2>
//         <p className="text-xl text-gray-200 dark:text-gray-200 mb-12 max-w-3xl mx-auto">
//           {t.heroSubtitle}
//         </p>
//       </div>

//     </section>
//   );
// }

// export default HeroSection;

// components/HeroSection.tsx
import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { Translation } from "@/lib/translations";
import { ArrowRight } from "lucide-react";

interface HeroSectionProps {
  t: Translation;
}

const HeroSection: FC<HeroSectionProps> = ({ t }) => {
  return (
    <section className="relative px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://exqjgmrrgwsvfklyzyga.supabase.co/storage/v1/object/public/car-images/12.jpg"
          alt="Luxury Car Fleet"
          fill
          priority
          quality={85}
          sizes="100vw"
          className="object-cover brightness-75 dark:brightness-60"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40 dark:bg-black/50"></div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto relative z-10 w-full py-8 sm:py-0">
        <div className="max-w-2xl">
          {/* Premium Badge */}
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <div className="w-6 sm:w-8 h-[1px] bg-brand-gold"></div>
            <span className="text-brand-gold text-xs sm:text-sm font-medium tracking-[0.15em] sm:tracking-[0.2em] uppercase">
              {t.heroPremiumBadge}
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
            {t.heroMainTitle}
          </h1>

          {/* Price */}
          <div className="mb-8">
            <p className="text-lg sm:text-xl md:text-2xl text-brand-gold font-semibold">
              {t.heroPrice}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/cars"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-brand-gold hover:bg-brand-gold/90 text-black font-semibold rounded-full transition-all duration-300 flex items-center justify-center gap-2 group text-sm sm:text-base"
            >
              {t.heroViewDetails}
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/booking"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-transparent border-2 border-white hover:bg-white hover:text-black text-white font-semibold rounded-full transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              {t.heroRentNow}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
