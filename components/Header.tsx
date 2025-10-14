// // components/Header.tsx
// import { Car, Heart, LocateFixed } from "lucide-react";
// import LanguageSwitcher from "./LanguageSwitcher";
// import ThemeToggle from "./ThemeToggle";
// import MobileMenu from "./MobileMenu";
// import { FC } from "react";
// import { Translation } from "@/lib/translations";
// import Link from "next/link";
// import { useFavorites } from "@/hooks/use-favorites";
// import Logo from "./Logo";
// interface HeaderProps {
//   currentLang: string;
//   handleLanguageChange: (lang: string) => void;
//   t: Translation;
// }
// const Header: FC<HeaderProps> = ({ currentLang, handleLanguageChange, t }) => {
//   const { count } = useFavorites();
//   return (
//     <header className="bg-white/80 dark:bg-brand-dark/80 backdrop-blur-md shadow-lg border-b border-gray-200/20 dark:border-gray-700/20 sticky top-0 z-30">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-20">
//           <div className="flex items-center space-x-2 cursor-pointer w-[150px] md:w-[200px] ">
//             <Logo lightSrc="/icons/black.svg" darkSrc="/icons/white.svg" heightClass="h-[150px] md:h-[200px]" />
//           </div>

//           {/* Desktop Navigation */}
//           {/* <nav className="hidden md:flex items-center space-x-8">
//             <Link
//               href="/"
//               className="text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors font-medium"
//             >
//              Home
//             </Link>
//             <Link
//               href="/cars"
//               className="text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors font-medium"
//             >
//               {t.cars}
//             </Link>
//             <Link
//               href="/services"
//               className="text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors font-medium"
//             >
//               {t.services || "Xidmətlər"}
//             </Link>
//             <Link
//               href="/about"
//               className="text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors font-medium"
//             >
//               {t.about}
//             </Link>
//             <Link
//               href="/contact"
//               className="text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors font-medium"
//             >
//               {t.contact}
//             </Link>
//           </nav> */}
//           <nav className="hidden md:flex items-center space-x-10">
//   {[
//     { href: "/", label: "Home" },
//     { href: "/cars", label: t.cars || "Maşınlar" },
//     { href: "/services", label: t.services || "Xidmətlər" },
//     { href: "/about", label: t.about || "Haqqımızda" },
//     { href: "/contact", label: t.contact || "Əlaqə" },
//   ].map((item) => (
//     <Link
//       key={item.href}
//       href={item.href}
//       className="relative group font-semibold tracking-wide text-gray-800 dark:text-gray-200"
//     >
//              <span className=" duration-100 group-hover:text-brand-gold dark:group-hover:text-brand-gold h-[1px]">
//         {item.label}
//       </span>

//              {/* Premium underline */}
//        <span className=" absolute -bottom-1 left-0 w-0 h-[1px] bg-gradient-to-r from-brand-gold via-yellow-400 to-brand-gold transition-all duration-500 group-hover:w-full rounded-full shadow-[0_0_8px_rgba(245,183,84,0.8)]"></span>
//     </Link>
//   ))}
// </nav>

//           {/* Desktop Controls */}
//           <div className="hidden md:flex items-center ">
//             <Link
//               href="/favorites"
//               className="relative inline-flex items-center text-gray-700 dark:text-gray-300 hover:text-brand-gold dark:hover:text-brand-gold"
//             >
//               <Heart className="h-5 w-5 mr-1" />

//               {count > 0 && (
//                 <span className="ml-2 inline-flex items-center justify-center h-5 min-w-[20px] px-1 rounded-full bg-brand-gold text-white text-xs">
//                   {count}
//                 </span>
//               )}
//             </Link>
//             <LanguageSwitcher
//               currentLang={currentLang}
//               onLanguageChange={handleLanguageChange}
//             />
//             <ThemeToggle />
//           </div>

//           {/* Mobile Menu */}
//           <MobileMenu
//             currentLang={currentLang}
//             onLanguageChange={handleLanguageChange}
//             t={t}
//           />
//         </div>
//       </div>
//     </header>
//   );
// };
// export default Header;
// components/Header.tsx
import { Car, Heart } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import MobileMenu from "./MobileMenu";
import CarCategoryDropdown from "./CarCategoryDropdown";
import { FC, useEffect, useState } from "react";
import { Translation } from "@/lib/translations";
import Link from "next/link";
import { useFavorites } from "@/hooks/use-favorites";
import Logo from "./Logo";
import { createNavigationHandler } from "@/lib/navigation-utils";

interface HeaderProps {
  currentLang: string;
  handleLanguageChange: (lang: string) => void;
  t: Translation;
}

const Header: FC<HeaderProps> = ({ currentLang, handleLanguageChange, t }) => {
  const { count } = useFavorites();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-header transition-colors duration-200 ${
        isScrolled
          ? "bg-white/80 dark:bg-brand-dark/80 backdrop-blur-md shadow-lg border-b border-gray-200/20 dark:border-[#2a2a2a]/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer w-[150px]">
            <Logo
              lightSrc="/icons/logowhite.png"
              darkSrc="/icons/logosyellow.png"
              lightHeightClass="h-[150px]"
              darkHeightClass="h-[150px]"
              lightWidthClass="w-[150px]"
              darkWidthClass="w-[150px]"
            />
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            {[
              { href: "/", label: t.home || "Ev" },
              { href: "/services", label: t.services || "Xidmətlər" },
              { href: "/about", label: t.about || "Haqqımızda" },
              { href: "/contact", label: t.contact || "Əlaqə" },
            ].map((item) => (
              <button
                key={item.href}
                onClick={() => window.location.href = item.href}
                className={`relative group font-semibold tracking-wide cursor-pointer ${
                  isScrolled ? "text-gray-800 dark:text-gray-200" : "text-white"
                }`}
              >
                <span className="duration-75 group-hover:text-brand-gold dark:group-hover:text-brand-gold">
                  {item.label}
                </span>
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gradient-to-r from-brand-gold via-yellow-400 to-brand-gold transition-all duration-200 group-hover:w-full rounded-full shadow-[0_0_8px_rgba(245,183,84,0.8)]"></span>
              </button>
            ))}

            {/* Car Category Dropdown */}
            <CarCategoryDropdown
              currentLang={currentLang}
              isScrolled={isScrolled}
              t={t}
            />
          </nav>

          {/* Controls */}
          <div className="hidden md:flex items-center ">
            <button
              onClick={() => window.location.href = "/favorites"}
              className={`relative inline-flex items-center cursor-pointer ${
                isScrolled ? "text-gray-500 dark:text-gray-300" : "text-white"
              } hover:text-brand-gold dark:hover:text-brand-gold`}
            >
              <Heart className="h-5 w-5 mr-1" />
              {count > 0 && (
                <span className="ml-2 inline-flex items-center justify-center h-5 min-w-[20px] px-1 rounded-full bg-brand-gold text-white text-xs">
                  {count}
                </span>
              )}
            </button>
            <LanguageSwitcher
              currentLang={currentLang}
              onLanguageChange={handleLanguageChange}
            />
            <ThemeToggle />
          </div>

          {/* Mobile */}
          <MobileMenu
            currentLang={currentLang}
            onLanguageChange={handleLanguageChange}
            t={t}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
