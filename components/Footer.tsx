
import { Car } from 'lucide-react';
import { Translation } from '@/lib/translations';
import Image from 'next/image';

interface FooterProps {
  t: Translation;
}

// const Footer: FC<FooterProps> = ({ t }) => {
//   return (
//     <footer className="bg-brand-dark dark:bg-brand-dark text-white py-12 border-t border-gray-800">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           <div>
//             <div className="flex items-center space-x-2 mb-4">
//               <Car className="h-8 w-8 text-brand-gold" />
//               <h3 className="text-2xl font-bold">Ram Servis</h3>
//             </div>
//             <p className="text-gray-400">
//               {t.footerDesc}
//             </p>
//           </div>
//           <div>
//             <h4 className="text-lg font-semibold mb-4">{t.contactInfo}</h4>
//             <div className="space-y-2 text-gray-400">
//               <p>{t.phone}: +994 XX XXX XX XX</p>
//               <p>{t.email}: info@ramservis.az</p>
//               <p>{t.address}: Bakı, Azərbaycan</p>
//             </div>
//           </div>
//           <div>
//             <h4 className="text-lg font-semibold mb-4">{t.workingHours}</h4>
//             <div className="space-y-2 text-gray-400">
//               <p>{t.mondayFriday}</p>
//               <p>{t.saturday}</p>
//               <p>{t.sunday}</p>
//             </div>
//           </div>
//         </div>
//         <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
//           <p>&copy; 2024 Ram Servis. {t.allRightsReserved}</p>
//         </div>
//       </div>
//     </footer>
//   );
// }

// export default Footer;


// components/Footer.tsx
import { FC } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Music,
  ArrowRight,
  ArrowUp,
} from "lucide-react";

const Footer: FC<FooterProps> = ({ t }) =>{
  return (
    <footer className="bg-brand-dark text-gray-300">
      {/* Top Contact Info */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-6 py-8 border-b border-[#2a2a2a]">
        <div className="flex items-center space-x-4 bg-[#1a1a1a] rounded-2xl p-4">
          <div className="bg-[#f5b754] p-3 rounded-full">
            <Phone className="text-black h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold">{t.footerCallUs}</p>
            <p className="text-white">+994 70 700 44 44</p>
          </div>
        </div>

        <div className="flex items-center space-x-4 bg-[#1a1a1a] rounded-2xl p-4">
          <div className="bg-[#f5b754] p-3 rounded-full">
            <Mail className="text-black h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold">{t.footerWriteToUs}</p>
            <p className="text-white">info@ramservis.az</p>
          </div>
        </div>

        <div className="flex items-center space-x-4 bg-[#1a1a1a] rounded-2xl p-4">
          <div className="bg-[#f5b754] p-3 rounded-full">
            <MapPin className="text-black h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold">{t.footerAddress}</p>
            <p className="text-white">27A Ahmed Racabli Baku Narimanov</p>
          </div>
        </div>
      </div>

      {/* Middle Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6 py-12">
        {/* Left Logo */}
        <div>
          <h2 className="text-3xl font-bold text-[#fbbf24] h-[110px] ">
             <Image src='/icons/logosyellow.png' alt='footerimg' width={200} height={100} style={{ width: '50%', height: 'auto' }} />
          </h2>
          <p className="mt-4 text-gray-400 text-sm">
            {t.footerDesc}
          </p>
          <div className="flex space-x-3 mt-6">
            <a
              href="#"
              className="border border-[#f5b754] rounded-full p-2 hover:bg-[#fbbf24] hover:text-black"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="border border-[#f5b754] rounded-full p-2 hover:bg-[#fbbf24] hover:text-black"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="border border-[#f5b754] rounded-full p-2 hover:bg-[#fbbf24] hover:text-black"
            >
              <Music className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4">{t.quickLinks}</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/about" className="hover:text-[#f5b754]">
                 {t.aboutLink}
              </a>
            </li>
            <li>
              <a href="/cars" className="hover:text-[#f5b754]">
                 {t.carsLink}
              </a>
            </li>
            <li>
              <a href="/bus" className="hover:text-[#f5b754]">
                 {t.busesLink}
              </a>
            </li>
            <li>
              <a href="" className="hover:text-[#f5b754]">
                 {t.carTypesLink}
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#f5b754]">
                 {t.faqLink}
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-[#f5b754]">
                {t.contactLink}
              </a>
            </li>
          </ul>
        </div>

        {/* Subscribe */}
        <div>
          <h3 className="text-xl font-semibold mb-4">{t.subscribe}</h3>
          <p className="text-sm text-gray-400 mb-4">
            {t.subscribeDesc}
          </p>
          <form className="flex items-center rounded-full border border-[#f5b754] overflow-hidden">
            <input
              type="email"
              placeholder={t.emailPlaceholderFooter}
              className="flex-1 bg-transparent px-4 py-3 text-sm outline-none"
            />
            <button
              type="submit"
              className="bg-[#f5b754] p-3 hover:bg-yellow-400"
            >
              <ArrowRight className="text-black h-5 w-5" />
            </button>
          </form>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-[#2a2a2a] py-6 px-6 max-w-7xl mx-auto flex justify-between items-center text-sm text-gray-400">
        <p>
          ©2025 <span className="text-[#fbbf24]">Ram Servis.</span> {t.allRightsReservedFooter}
        </p>
        <a
          href="#"
          className="bg-[#1a1a1a] border border-[#fbbf24] rounded-full p-3 hover:bg-[#fbbf24] hover:text-black"
        >
          <ArrowUp className="h-5 w-5" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;

