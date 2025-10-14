// components/FixedHeader.tsx
import { Heart } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import MobileMenu from "./MobileMenu";
import CarCategoryDropdown from "./CarCategoryDropdown";
import { FC } from "react";
import { Translation } from "@/lib/translations";
import { useFavorites } from "@/hooks/use-favorites";
import Logo from "./Logo";
import { createNavigationHandler } from "@/lib/navigation-utils";

interface FixedHeaderProps {
  currentLang: string;
  handleLanguageChange: (lang: string) => void;
  t: Translation;
}

const FixedHeader: FC<FixedHeaderProps> = ({ currentLang, handleLanguageChange, t }) => {
  const { count } = useFavorites();

  return (
    <header className="fixed top-0 w-full z-50 bg-white/90 dark:bg-brand-dark/90 backdrop-blur-md shadow-lg border-b border-gray-200/20 dark:border-[#2a2a2a]/20">
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
              <a
                key={item.href}
                href={item.href}
                onClick={createNavigationHandler(item.href)}
                className="relative group font-semibold tracking-wide cursor-pointer text-gray-800 dark:text-gray-200"
              >
                <span className="duration-75 group-hover:text-brand-gold dark:group-hover:text-brand-gold">
                  {item.label}
                </span>
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gradient-to-r from-brand-gold via-yellow-400 to-brand-gold transition-all duration-200 group-hover:w-full rounded-full shadow-[0_0_8px_rgba(245,183,84,0.8)]"></span>
              </a>
            ))}

            {/* Car Category Dropdown */}
            <CarCategoryDropdown
              currentLang={currentLang}
              isScrolled={true}
              t={t}
            />
          </nav>

          {/* Controls */}
          <div className="hidden md:flex items-center ">
            <a
              href="/favorites"
              onClick={createNavigationHandler("/favorites")}
              className="relative inline-flex items-center cursor-pointer text-gray-500 dark:text-gray-300 hover:text-brand-gold dark:hover:text-brand-gold"
            >
              <Heart className="h-5 w-5 mr-1" />
              {count > 0 && (
                <span className="ml-2 inline-flex items-center justify-center h-5 min-w-[20px] px-1 rounded-full bg-brand-gold text-white text-xs">
                  {count}
                </span>
              )}
            </a>
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

export default FixedHeader;