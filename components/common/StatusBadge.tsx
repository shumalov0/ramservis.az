'use client';

import { memo } from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Clock, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'success' | 'warning' | 'error' | 'pending' | 'info';
  text: string;
  showIcon?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

const StatusBadge = memo(function StatusBadge({
  status,
  text,
  showIcon = true,
  size = 'md',
  className
}: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'success':
        return {
          variant: 'default' as const,
          className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
          icon: CheckCircle
        };
      case 'warning':
        return {
          variant: 'secondary' as const,
          className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
          icon: AlertCircle
        };
      case 'error':
        return {
          variant: 'destructive' as const,
          className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
          icon: XCircle
        };
      case 'pending':
        return {
          variant: 'outline' as const,
          className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
          icon: Clock
        };
      default:
        return {
          variant: 'secondary' as const,
          className: 'bg-gray-100 text-gray-800 dark:bg-[#1a1a1a] dark:text-gray-300',
          icon: AlertCircle
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;
  const iconSize = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';

  return (
    <Badge
      variant={config.variant}
      className={cn(
        config.className,
        size === 'sm' ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1',
        className
      )}
    >
      {showIcon && <Icon className={cn(iconSize, 'mr-1')} />}
      {text}
    </Badge>
  );
});

export default StatusBadge;