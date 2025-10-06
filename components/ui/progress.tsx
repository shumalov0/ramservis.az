'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface SimpleProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number; // 0-100
  max?: number; // default 100
}

const Progress = React.forwardRef<HTMLDivElement, SimpleProgressProps>(
  ({ className, value = 0, max = 100, ...props }, ref) => {
    const safeMax = max > 0 ? max : 100;
    const clamped = Math.max(0, Math.min(100, (value / safeMax) * 100));
    return (
      <div
        ref={ref}
        className={cn('relative h-4 w-full overflow-hidden rounded-full bg-secondary', className)}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuenow={Math.round((clamped / 100) * safeMax)}
        {...props}
      >
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${clamped}%` }}
        />
      </div>
    );
  }
);
Progress.displayName = 'Progress';

export { Progress };
