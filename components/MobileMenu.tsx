// "use client";

// import { Button } from "@/components/ui/button";
// import { Car, Heart, Menu } from "lucide-react";
// import LanguageSwitcher from "./LanguageSwitcher";
// import ThemeToggle from "./ThemeToggle";
// import { Translation } from "@/lib/translations";
// import Link from "next/link";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import { useFavorites } from "@/hooks/use-favorites";
// import Logo from "./Logo";

// interface MobileMenuProps {
//   currentLang: string;
//   onLanguageChange: (lang: string) => void;
//   t: Translation;
// }

// export default function MobileMenu({
//   currentLang,
//   onLanguageChange,
//   t,
// }: MobileMenuProps) {
//   const { count } = useFavorites();
//   const menuItems = [
//     { href: "/", label: t?.cars || "Home" },
//     { href: "/cars", label: t?.cars || "Cars" },
//     { href: "/services", label: t?.services || "Services" },
//     { href: "/about", label: t?.about || "About" },
//     { href: "/contact", label: t?.contact || "Contact" },
//   ];

//   return (
//     <Sheet>
//       <SheetTrigger asChild>
//         <Button
//           variant="ghost"
//           size="icon"
//           className="md:hidden w-9 h-9 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] rounded-full"
//           aria-label="Open menu"
//         >
//           <Menu className="h-5 w-5" />
//         </Button>
//       </SheetTrigger>
//       <SheetContent
//         side="right"
//         className="w-80 max-w-[90vw] bg-white dark:bg-[#1a1a1a] border-l border-gray-200 dark:border-[#2a2a2a] p-0"
//       >
//         <div className="flex flex-col h-full">
//           <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
//             <Link
//               href="/"
//               className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
//             >
//           <div className="flex items-center space-x-2 cursor-pointer w-8  h-8">
//             <Logo lightSrc="/icons/black.svg" darkSrc="/icons/white.svg" heightClass="h-[150px] " />
//           </div>
//             </Link>

//                           <LanguageSwitcher
//                 currentLang={currentLang}
//                 onLanguageChange={onLanguageChange}
//               />
//           </div>

//           <nav className="flex-1 px-6 py-8 overflow-y-auto">
//             <ul className="space-y-6">
//               {menuItems.map((item) => (
//                 <li key={item.href}>
//                   <Link
//                     href={item.href}
//                     className="block text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors py-3 px-4 rounded-lg hover:bg-amber-50/50 dark:hover:bg-[#1a1a1a]/50"
//                   >
//                     {item.label}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </nav>

//           <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
//             <div className="flex items-center justify-between">
//             <Link
//               href="/favorites"
//               className="relative inline-flex items-center text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400"
//             >
//               <Heart className="h-5 w-5 mr-1" />

//               {count > 0 && (
//                 <span className="ml-2 inline-flex items-center justify-center h-5 min-w-[20px] px-1 rounded-full bg-amber-600 text-white text-xs">
//                   {count}
//                 </span>
//               )}
//             </Link>
//               <ThemeToggle />
//             </div>
//           </div>
//         </div>
//       </SheetContent>
//     </Sheet>
//   );
// }
// "use client";

// import { Button } from "@/components/ui/button";
// import { Car, Heart, Menu, Info, Phone, Home } from "lucide-react";
// import LanguageSwitcher from "./LanguageSwitcher";
// import ThemeToggle from "./ThemeToggle";
// import { Translation } from "@/lib/translations";
// import Link from "next/link";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import { useFavorites } from "@/hooks/use-favorites";
// import Logo from "./Logo";
// import { motion } from "framer-motion";

// interface MobileMenuProps {
//   currentLang: string;
//   onLanguageChange: (lang: string) => void;
//   t: Translation;
// }

// export default function MobileMenu({
//   currentLang,
//   onLanguageChange,
//   t,
// }: MobileMenuProps) {
//   const { count } = useFavorites();

//   const menuItems = [
//     { href: "/", label: t?.home || "Home", icon: Home },
//     { href: "/cars", label: t?.cars || "Cars", icon: Car },
//     { href: "/services", label: t?.services || "Services", icon: Info },
//     { href: "/about", label: t?.about || "About", icon: Info },
//     { href: "/contact", label: t?.contact || "Contact", icon: Phone },
//   ];

//   return (
//     <Sheet>
//       <SheetTrigger asChild>
//         <Button
//           variant="ghost"
//           size="icon"
//           className="md:hidden w-10 h-10 text-gray-700 dark:text-gray-300 hover:bg-gray-200/40 dark:hover:bg-[#1a1a1a]/40 rounded-full"
//           aria-label="Open menu"
//         >
//           <Menu className="h-6 w-6" />
//         </Button>
//       </SheetTrigger>
//       <SheetContent
//         side="right"
//         className="w-80 max-w-[90vw] bg-white/70 dark:bg-[#1a1a1a]/70 border-l border-gray-200/30 dark:border-[#2a2a2a]/30 backdrop-blur-xl p-0 shadow-2xl"
//       >
//         <div className="flex flex-col h-full">
//           {/* Header */}
//           <div className="flex items-center justify-between p-6 border-b border-gray-200/30 dark:border-gray-700/30">
//             <Link
//               href="/"
//               className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
//             >
//               <div className="flex items-center space-x-2 cursor-pointer w-8 h-8">
//                 <Logo
//                   lightSrc="/icons/black.svg"
//                   darkSrc="/icons/white.svg"
//                   heightClass="h-[140px]"
//                 />
//               </div>
//             </Link>

//             <LanguageSwitcher
//               currentLang={currentLang}
//               onLanguageChange={onLanguageChange}
//             />
//           </div>

//           {/* Navigation */}
//           <nav className="flex-1 px-6 py-8 overflow-y-auto">
//             <ul className="space-y-4">
//               {menuItems.map((item, i) => (
//                 <motion.li
//                   key={item.href}
//                   initial={{ opacity: 0, x: 30 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: i * 0.08 }}
//                 >
//                   <Link
//                     href={item.href}
//                     className="flex items-center gap-3 text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-all py-3 px-4 rounded-xl hover:bg-amber-50/60 dark:hover:bg-[#1a1a1a]/50 hover:scale-[1.02]"
//                   >
//                     <item.icon className="h-5 w-5 text-amber-500" />
//                     {item.label}
//                   </Link>
//                 </motion.li>
//               ))}
//             </ul>
//           </nav>

//           {/* Footer */}
//           <div className="p-6 border-t border-gray-200/30 dark:border-gray-700/30">
//             <div className="flex items-center justify-between">
//               <Link
//                 href="/favorites"
//                 className="relative inline-flex items-center text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
//               >
//                 <Heart className="h-5 w-5 mr-2" />
//                 {count > 0 && (
//                   <motion.span
//                     initial={{ scale: 0 }}
//                     animate={{ scale: 1 }}
//                     transition={{ type: "spring", stiffness: 300 }}
//                     className="ml-1 inline-flex items-center justify-center h-5 min-w-[20px] px-1 rounded-full bg-amber-600 text-white text-xs shadow-md"
//                   >
//                     {count}
//                   </motion.span>
//                 )}
//               </Link>
//               <ThemeToggle />
//             </div>
//           </div>
//         </div>
//       </SheetContent>
//     </Sheet>
//   );
// }

"use client";

import { Button } from "@/components/ui/button";
import {
  Car,
  Heart,
  Menu,
  Info,
  Phone,
  Home,
  X,
  ChevronDown,
} from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import { Translation } from "@/lib/translations";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useFavorites } from "@/hooks/use-favorites";
import Logo from "./Logo";
import { carCategories } from "@/lib/data";
import { useState } from "react";

interface MobileMenuProps {
  currentLang: string;
  onLanguageChange: (lang: string) => void;
  t: Translation;
}

export default function MobileMenu({
  currentLang,
  onLanguageChange,
  t,
}: MobileMenuProps) {
  const { count } = useFavorites();
  const [isCarsExpanded, setIsCarsExpanded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { href: "/", label: t?.home || "Ev", icon: Home },
    { href: "/services", label: t?.services || "Xidmətlər", icon: Info },
    { href: "/about", label: t?.about || "Haqqımızda", icon: Info },
    { href: "/contact", label: t?.contact || "Əlaqə", icon: Phone },
  ];

  const handleNavigation = (href: string) => {
    setIsOpen(false);
    setTimeout(() => {
      window.location.href = href;
    }, 150);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      {/* Trigger button */}
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden w-10 h-10 text-gray-700 dark:text-gray-300 hover:bg-gray-200/40 dark:hover:bg-[#1a1a1a]/40 rounded-full"
          aria-label="Open menu"
          onClick={() => setIsOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>

      {/* Menu Content */}
      <SheetContent
        side="right"
        className="w-80 max-w-[90vw] bg-white dark:bg-brand-dark border-l border-gray-200/30 dark:border-gray-700/30 p-0 shadow-2xl z-sheet [&>button:first-of-type]:hidden"
      >
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <SheetDescription className="sr-only">Main navigation menu for the website</SheetDescription>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200/30 dark:border-gray-700/30">
            {/* Logo */}
            <button
              onClick={() => handleNavigation("/")}
              className="flex items-center space-x-2 cursor-pointer w-8 h-8"
            >
              <Logo
                lightSrc="/icons/logowhite.png"
                darkSrc="/icons/logosyellow.png"
                heightClass="h-[140px]"
              />
            </button>

            {/* Language + Close */}
            <div className="flex items-center gap-2">
              <LanguageSwitcher
                currentLang={currentLang}
                onLanguageChange={onLanguageChange}
              />
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 rounded-full hover:bg-gray-200/60 dark:hover:bg-[#1a1a1a]/60 transition"
                aria-label="Close menu"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-6 py-8 overflow-y-auto">
            <ul className="space-y-4">
              {menuItems.map((item, i) => (
                <li key={item.href}>
                  <button
                    onClick={() => handleNavigation(item.href)}
                    className="flex items-center gap-3 text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-brand-gold dark:hover:text-brand-gold active:text-brand-gold transition-colors py-3 px-4 rounded-xl hover:bg-amber-50/60 dark:hover:bg-[#1a1a1a]/50 active:bg-amber-100/60 dark:active:bg-[#1a1a1a]/70 w-full text-left touch-manipulation"
                  >
                    <item.icon className="h-5 w-5 text-brand-gold" />
                    {item.label}
                  </button>
                </li>
              ))}

              {/* Cars Section with Dropdown */}
              <li>
                <div className="space-y-2">
                  {/* Cars Main Button */}
                  <button
                    onClick={() => setIsCarsExpanded(!isCarsExpanded)}
                    className="flex items-center justify-between w-full gap-3 text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-brand-gold dark:hover:text-brand-gold active:text-brand-gold transition-all py-3 px-4 rounded-xl hover:bg-amber-50/60 dark:hover:bg-slate-800/50 active:bg-amber-100/60 dark:active:bg-slate-800/70 touch-manipulation"
                  >
                    <div className="flex items-center gap-3">
                      <Car className="h-5 w-5 text-brand-gold" />
                      {t?.cars || "Maşınlar"}
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        isCarsExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Car Categories Submenu */}
                  <div
                    className={`overflow-hidden transition-all duration-200 ${
                      isCarsExpanded
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="pl-8 space-y-2">
                      {/* All Cars Link */}
                      <button
                        onClick={() => handleNavigation("/cars")}
                        className="flex items-center gap-3 text-base font-medium text-gray-600 dark:text-gray-400 hover:text-brand-gold dark:hover:text-brand-gold transition-all py-2 px-3 rounded-lg hover:bg-amber-50/40 dark:hover:bg-slate-800/30 w-full text-left"
                      >
                        <span className="text-sm">🚗</span>
                        Bütün Maşınlar
                      </button>

                      {/* Category Links */}
                      {carCategories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => handleNavigation(`/cars?category=${category.displayName}`)}
                          className="flex items-center gap-3 text-base font-medium text-gray-600 dark:text-gray-400 hover:text-brand-gold dark:hover:text-brand-gold transition-all py-2 px-3 rounded-lg hover:bg-amber-50/40 dark:hover:bg-slate-800/30 w-full text-left"
                        >
                          <span className="text-sm">{category.icon}</span>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span>{category.displayName}</span>
                              {category.count && (
                                <span className="text-xs bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                                  {category.count}
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200/30 dark:border-gray-700/30">
            <div className="flex items-center justify-between">
              <button
                onClick={() => handleNavigation("/favorites")}
                className="relative inline-flex items-center text-gray-700 dark:text-gray-300 hover:text-brand-gold dark:hover:text-brand-gold transition-colors"
              >
                <Heart className="h-5 w-5 mr-2" />
                {count > 0 && (
                  <span className="ml-1 inline-flex items-center justify-center h-5 min-w-[20px] px-1 rounded-full bg-brand-gold text-white text-xs shadow-md">
                    {count}
                  </span>
                )}
              </button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
