"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Globe } from "lucide-react";

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: "az", name: "Azərbaycan", flag: "🇦🇿" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
];

interface LanguageSwitcherProps {
  currentLang: string;
  onLanguageChange: (lang: string) => void;
}

export default function LanguageSwitcher({
  currentLang,
  onLanguageChange,
}: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage =
    languages.find((lang) => lang.code === currentLang) || languages[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-transparent dark:bg-transparent transition-colors"
      >
        <span className="text-lg">{currentLanguage.flag}</span>

        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-brand-dark/70 rounded-2xl py-2 z-50 animate-in slide-in-from-top-2 duration-200 shadow-lg border border-gray-200/30 dark:border-gray-700/30">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => {
                onLanguageChange(language.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-100 dark:bg-brand-dark/10 transition-colors ${
                currentLang === language.code
                  ? "bg-blue-50 dark:bg-brand-dark/30  text-blue-600 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              <span className="text-lg">{language.flag}</span>
              <span>{language.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
