'use client';

import { memo } from 'react';
import { cn } from '@/lib/utils';

interface PriceDisplayProps {
  amount: number;
  currency?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCurrency?: boolean;
  className?: string;
  prefix?: string;
  suffix?: string;
}

const PriceDisplay = memo(function PriceDisplay({
  amount,
  currency = '₼',
  size = 'md',
  showCurrency = true,
  className,
  prefix,
  suffix
}: PriceDisplayProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-2xl'
  };

  const formatAmount = (value: number) => {
    return new Intl.NumberFormat('az-AZ', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <span className={cn('font-semibold', sizeClasses[size], className)}>
      {prefix}
      {formatAmount(amount)}
      {showCurrency && currency}
      {suffix}
    </span>
  );
});

export default PriceDisplay;