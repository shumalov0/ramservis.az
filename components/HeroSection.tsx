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
import { FC } from 'react';
import { Translation } from '@/lib/translations';

interface HeroSectionProps {
  t: Translation;
}

const HeroSection: FC<HeroSectionProps> = ({ t }) => {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/cars/12.jpg"
          alt="Luxury Car Fleet"
          className="w-full h-full object-cover brightness-90 dark:brightness-75"
        />
        {/* Light və Dark overlay */}
        <div className="absolute inset-0 bg-black/25 dark:bg-black/50"></div>

        {/* Gradient overlay (yumşaq keçid) */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/40 dark:from-black/70 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <h2 className="text-5xl font-bold text-white mb-6">
          {t.heroTitle.split(' ').slice(0, -2).join(' ')}{' '}
          <span className="text-brand-gold">{t.heroTitle.split(' ').slice(-2).join(' ')}</span>
        </h2>
        <p className="text-xl text-gray-200 mb-12 max-w-3xl mx-auto">
          {t.heroSubtitle}
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
