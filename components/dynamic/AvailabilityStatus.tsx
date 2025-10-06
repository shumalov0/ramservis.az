'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AvailabilityStatusProps {
  carId: string;
  onAvailabilityChange?: (available: boolean) => void;
}

interface AvailabilityData {
  available: boolean;
  nextAvailable?: Date;
  blockedDates: Date[];
  lastUpdated: Date;
}

export default function AvailabilityStatus({ carId, onAvailabilityChange }: AvailabilityStatusProps) {
  const [availability, setAvailability] = useState<AvailabilityData>({
    available: true,
    blockedDates: [],
    lastUpdated: new Date()
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simulate real-time availability checking
  const checkAvailability = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock availability logic - in real app, this would be an API call
      const mockAvailability: AvailabilityData = {
        available: Math.random() > 0.2, // 80% chance of being available
        nextAvailable: Math.random() > 0.5 ? new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) : undefined,
        blockedDates: [
          new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
        ],
        lastUpdated: new Date()
      };
      
      setAvailability(mockAvailability);
      onAvailabilityChange?.(mockAvailability.available);
    } catch (err) {
      setError('Failed to check availability');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-refresh availability every 30 seconds
  useEffect(() => {
    checkAvailability();
    const interval = setInterval(checkAvailability, 30000);
    return () => clearInterval(interval);
  }, [carId]);

  const formatLastUpdated = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    return `${Math.floor(diffInSeconds / 3600)}h ago`;
  };

  if (error) {
    return (
      <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <span className="text-red-700 dark:text-red-300">{error}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={checkAvailability}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {isLoading ? (
              <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
            ) : availability.available ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            
            <Badge 
              variant={availability.available ? "default" : "destructive"}
              className={availability.available ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : ""}
            >
              {availability.available ? 'Available Now' : 'Currently Unavailable'}
            </Badge>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={checkAvailability}
            disabled={isLoading}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {!availability.available && availability.nextAvailable && (
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
            <Clock className="h-4 w-4" />
            <span>Next available: {availability.nextAvailable.toISOString().split('T')[0]}</span>
          </div>
        )}

        <div className="text-xs text-gray-500 dark:text-gray-400">
          Last updated: {formatLastUpdated(availability.lastUpdated)}
        </div>
      </CardContent>
    </Card>
  );
}