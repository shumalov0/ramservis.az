'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Calendar as CalendarIcon,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Clock
} from 'lucide-react';
import { format, addDays, isBefore, isAfter, isSameDay } from 'date-fns';
import { az } from 'date-fns/locale';

interface AvailabilityCheckerProps {
  carId: string;
  selectedDates: {
    start: Date;
    end: Date;
  };
  onAvailabilityChange: (available: boolean, message?: string) => void;
}

interface AvailabilityData {
  available: boolean;
  blockedDates: Date[];
  partiallyAvailable: Date[];
  message?: string;
  alternativeDates?: {
    start: Date;
    end: Date;
  }[];
}

export function AvailabilityChecker({
  carId,
  selectedDates,
  onAvailabilityChange
}: AvailabilityCheckerProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [availabilityData, setAvailabilityData] = useState<AvailabilityData | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  // Mock blocked dates - in real app, this would come from API
  const mockBlockedDates = [
    new Date(2024, 11, 15), // December 15, 2024
    new Date(2024, 11, 16), // December 16, 2024
    new Date(2024, 11, 25), // December 25, 2024
    new Date(2024, 11, 26), // December 26, 2024
    new Date(2025, 0, 1),   // January 1, 2025
    new Date(2025, 0, 7),   // January 7, 2025
    new Date(2025, 0, 8),   // January 8, 2025
  ];

  const checkAvailability = useCallback(async () => {
    if (!selectedDates.start || !selectedDates.end) {
      return;
    }

    setIsChecking(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if any selected dates are blocked
      const selectedDateRange = [];
      let currentDate = new Date(selectedDates.start);
      
      while (currentDate <= selectedDates.end) {
        selectedDateRange.push(new Date(currentDate));
        currentDate = addDays(currentDate, 1);
      }
      
      const conflictingDates = selectedDateRange.filter(date =>
        mockBlockedDates.some(blockedDate => isSameDay(date, blockedDate))
      );
      
      const isAvailable = conflictingDates.length === 0;
      
      let message = '';
      let alternativeDates: { start: Date; end: Date }[] = [];
      
      if (!isAvailable) {
        message = `Seçilmiş tarixlərdən ${conflictingDates.length} günü mövcud deyil`;
        
        // Suggest alternative dates
        const daysDiff = Math.ceil((selectedDates.end.getTime() - selectedDates.start.getTime()) / (1000 * 60 * 60 * 24));
        
        // Find next available period
        let searchDate = addDays(selectedDates.end, 1);
        for (let i = 0; i < 30; i++) { // Search for 30 days
          const potentialStart = addDays(searchDate, i);
          const potentialEnd = addDays(potentialStart, daysDiff);
          
          const potentialRange = [];
          let checkDate = new Date(potentialStart);
          while (checkDate <= potentialEnd) {
            potentialRange.push(new Date(checkDate));
            checkDate = addDays(checkDate, 1);
          }
          
          const hasConflict = potentialRange.some(date =>
            mockBlockedDates.some(blockedDate => isSameDay(date, blockedDate))
          );
          
          if (!hasConflict) {
            alternativeDates.push({
              start: potentialStart,
              end: potentialEnd
            });
            break;
          }
        }
      } else {
        message = 'Avtomobil seçilmiş tarixlər üçün mövcuddur';
      }
      
      const availability: AvailabilityData = {
        available: isAvailable,
        blockedDates: mockBlockedDates,
        partiallyAvailable: [],
        message,
        alternativeDates
      };
      
      setAvailabilityData(availability);
      setLastChecked(new Date());
      onAvailabilityChange(isAvailable, message);
      
    } catch (error) {
      const errorMessage = 'Mövcudluq yoxlanılarkən xəta baş verdi';
      setAvailabilityData({
        available: false,
        blockedDates: [],
        partiallyAvailable: [],
        message: errorMessage
      });
      onAvailabilityChange(false, errorMessage);
    } finally {
      setIsChecking(false);
    }
  }, [carId, selectedDates, onAvailabilityChange]);

  // Check availability when dates change
  useEffect(() => {
    if (selectedDates.start && selectedDates.end && isAfter(selectedDates.end, selectedDates.start)) {
      const timeoutId = setTimeout(() => {
        checkAvailability();
      }, 500); // Debounce the check

      return () => clearTimeout(timeoutId);
    }
  }, [selectedDates, checkAvailability]);

  const getAvailabilityStatus = () => {
    if (isChecking) {
      return {
        icon: <RefreshCw className="h-4 w-4 animate-spin" />,
        text: 'Yoxlanılır...',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      };
    }

    if (!availabilityData) {
      return {
        icon: <Clock className="h-4 w-4" />,
        text: 'Gözləyir',
        color: 'bg-gray-100 text-gray-800 dark:bg-[#1a1a1a] dark:text-gray-200'
      };
    }

    if (availabilityData.available) {
      return {
        icon: <CheckCircle className="h-4 w-4" />,
        text: 'Mövcuddur',
        color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      };
    }

    return {
      icon: <XCircle className="h-4 w-4" />,
      text: 'Mövcud deyil',
      color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
  };

  const status = getAvailabilityStatus();

  return (
    <div className="space-y-4">
      {/* Status Display */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Mövcudluq:
          </span>
          <Badge className={`${status.color} border-0`}>
            {status.icon}
            <span className="ml-1">{status.text}</span>
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {lastChecked && (
            <span className="text-xs text-gray-500">
              {format(lastChecked, 'HH:mm', { locale: az })}
            </span>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={checkAvailability}
            disabled={isChecking || !selectedDates.start || !selectedDates.end}
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${isChecking ? 'animate-spin' : ''}`} />
            Yenilə
          </Button>

          <Popover open={showCalendar} onOpenChange={setShowCalendar}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <CalendarIcon className="h-3 w-3 mr-1" />
                Təqvim
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="multiple"
                selected={availabilityData?.blockedDates || []}
                disabled={(date) => isBefore(date, new Date())}
                className="rounded-md border"
                modifiers={{
                  blocked: availabilityData?.blockedDates || [],
                  selected: [selectedDates.start, selectedDates.end].filter(Boolean)
                }}
                modifiersStyles={{
                  blocked: { 
                    backgroundColor: '#fee2e2', 
                    color: '#dc2626',
                    textDecoration: 'line-through'
                  },
                  selected: { 
                    backgroundColor: '#dbeafe', 
                    color: '#1d4ed8' 
                  }
                }}
              />
              <div className="p-3 border-t">
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-200 rounded"></div>
                    <span>Mövcud deyil</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-200 rounded"></div>
                    <span>Seçilmiş</span>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Availability Message */}
      {availabilityData?.message && (
        <Alert className={
          availabilityData.available 
            ? "border-green-200 bg-green-50 dark:bg-green-900/20"
            : "border-red-200 bg-red-50 dark:bg-red-900/20"
        }>
          {availabilityData.available ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription className={
            availabilityData.available
              ? "text-green-800 dark:text-green-200"
              : "text-red-800 dark:text-red-200"
          }>
            {availabilityData.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Alternative Dates */}
      {availabilityData?.alternativeDates && availabilityData.alternativeDates.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Alternativ tarixlər:
            </h4>
            <div className="space-y-2">
              {availabilityData.alternativeDates.slice(0, 3).map((dates, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 dark:bg-[#1a1a1a] rounded-lg"
                >
                  <div className="text-sm">
                    <span className="font-medium">
                      {format(dates.start, 'dd MMM', { locale: az })} - {format(dates.end, 'dd MMM', { locale: az })}
                    </span>
                    <span className="text-gray-500 ml-2">
                      ({Math.ceil((dates.end.getTime() - dates.start.getTime()) / (1000 * 60 * 60 * 24))} gün)
                    </span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      // This would trigger a callback to update the parent form dates
                      // For now, we'll just show it's clickable
                    }}
                  >
                    Seç
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Blocked Dates Summary */}
      {availabilityData?.blockedDates && availabilityData.blockedDates.length > 0 && (
        <div className="text-xs text-gray-500">
          <span>Mövcud olmayan tarixlər: </span>
          <span>
            {availabilityData.blockedDates
              .slice(0, 3)
              .map(date => format(date, 'dd MMM', { locale: az }))
              .join(', ')}
            {availabilityData.blockedDates.length > 3 && ` və ${availabilityData.blockedDates.length - 3} digər`}
          </span>
        </div>
      )}
    </div>
  );
}