'use client';

import { useState, useEffect } from 'react';
import { DollarSign, Euro, TrendingUp } from 'lucide-react';

interface CurrencyConverterProps {
  aznPrice: number;
  size?: 'sm' | 'md';
}

const EXCHANGE_RATES = {
  USD: 1.7,  // 1 USD = 1.7 AZN
  EUR: 1.85, // 1 EUR = 1.85 AZN
};

export default function CurrencyConverter({ aznPrice, size = 'md' }: CurrencyConverterProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<'AZN' | 'USD' | 'EUR'>('AZN');
  const [isOpen, setIsOpen] = useState(false);

  const convertPrice = (currency: 'AZN' | 'USD' | 'EUR') => {
    if (currency === 'AZN') return aznPrice;
    return (aznPrice / EXCHANGE_RATES[currency]).toFixed(0);
  };

  const getCurrencySymbol = (currency: 'AZN' | 'USD' | 'EUR') => {
    switch (currency) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'AZN': return '₼';
    }
  };

  const getCurrencyIcon = (currency: 'AZN' | 'USD' | 'EUR') => {
    const iconSize = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';
    switch (currency) {
      case 'USD': return <DollarSign className={iconSize} />;
      case 'EUR': return <Euro className={iconSize} />;
      case 'AZN': return <TrendingUp className={iconSize} />;
    }
  };

  const currencies: Array<'AZN' | 'USD' | 'EUR'> = ['AZN', 'USD', 'EUR'];

  const textSize = size === 'sm' ? 'text-sm' : 'text-base';
  const buttonPadding = size === 'sm' ? 'px-2 py-1' : 'px-3 py-1.5';

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-1.5 ${buttonPadding} bg-gray-100 dark:bg-gray-800 
          hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200
          border border-gray-200 dark:border-gray-700 ${textSize}`}
      >
        {getCurrencyIcon(selectedCurrency)}
        <span className="font-semibold text-gray-900 dark:text-white">
          {getCurrencySymbol(selectedCurrency)}{convertPrice(selectedCurrency)}
        </span>
        <svg 
          className={`${size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg 
            border border-gray-200 dark:border-gray-700 z-20 overflow-hidden">
            {currencies.map((currency) => (
              <button
                key={currency}
                onClick={() => {
                  setSelectedCurrency(currency);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 hover:bg-gray-100 
                  dark:hover:bg-gray-700 transition-colors duration-150 ${textSize}
                  ${selectedCurrency === currency ? 'bg-gray-50 dark:bg-gray-700/50' : ''}`}
              >
                <div className="flex items-center space-x-2">
                  {getCurrencyIcon(currency)}
                  <span className="font-medium text-gray-900 dark:text-white">{currency}</span>
                </div>
                <span className="text-gray-600 dark:text-gray-400 font-semibold">
                  {getCurrencySymbol(currency)}{convertPrice(currency)}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
