'use client';

import { useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface AvailabilityStatusProps {
  carId: string;
  onAvailabilityChange?: (available: boolean) => void;
}

export default function AvailabilityStatus({ onAvailabilityChange }: AvailabilityStatusProps) {
  useEffect(() => {
    onAvailabilityChange?.(true);
  }, [onAvailabilityChange]);

  return (
    <Card className="bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-sm border border-green-100 dark:border-green-900/40">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <div>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              Available Now
            </Badge>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Bu avtomobil filomuzdadır və dərhal icarə üçün hazırdır.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}