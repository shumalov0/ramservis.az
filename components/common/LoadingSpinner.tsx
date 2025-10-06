'use client';

import { memo } from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

const LoadingSpinner = memo(function LoadingSpinner({
  size = 'md',
  className,
  text
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      <div
        className={cn(
          'border-2 border-gray-300 border-t-transparent rounded-full animate-spin',
          sizeClasses[size]
        )}
      />
      {text && (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {text}
        </span>
      )}
    </div>
  );
});

export default LoadingSpinner;