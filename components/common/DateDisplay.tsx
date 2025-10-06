'use client';

import { memo, useMemo } from 'react';

interface DateDisplayProps {
  date: string | Date;
  format?: 'short' | 'long' | 'relative';
  locale?: string;
  className?: string;
}

const DateDisplay = memo(function DateDisplay({
  date,
  format = 'short',
  locale = 'az-AZ',
  className
}: DateDisplayProps) {
  const formattedDate = useMemo(() => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (format === 'relative') {
      const now = new Date();
      const diffInMs = dateObj.getTime() - now.getTime();
      const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
      
      if (diffInDays === 0) return 'Bugün';
      if (diffInDays === 1) return 'Sabah';
      if (diffInDays === -1) return 'Dünən';
      if (diffInDays > 0) return `${diffInDays} gün sonra`;
      return `${Math.abs(diffInDays)} gün əvvəl`;
    }
    
    const options: Intl.DateTimeFormatOptions = format === 'long' 
      ? { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
      : { year: 'numeric', month: 'short', day: 'numeric' };
    
    return dateObj.toLocaleDateString(locale, options);
  }, [date, format, locale]);

  return (
    <span className={className}>
      {formattedDate}
    </span>
  );
});

export default DateDisplay;