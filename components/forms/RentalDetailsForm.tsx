'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, MapPin, Clock, AlertCircle } from 'lucide-react';
import { BookingFormData, EnhancedCar } from '@/lib/types';
import { locations } from '@/lib/data';
import { useTranslation } from '@/lib/translations';

interface RentalDetailsFormProps {
  formData: Partial<BookingFormData>;
  onUpdate: (updates: Partial<BookingFormData>) => void;
  currentLang: string;
  errors: Record<string, string>;
  car: EnhancedCar | null;
}

export default function RentalDetailsForm({
  formData,
  onUpdate,
  currentLang,
  errors,
  car
}: RentalDetailsFormProps) {
  const t = useTranslation(currentLang);

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    onUpdate({ [field]: value });
  };

  // Prevent space key from triggering unwanted actions on container
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Only prevent space if it's on the container div itself, not on input elements
    if (e.key === ' ' && e.target === e.currentTarget && e.currentTarget.tagName === 'DIV') {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const calculateRentalDays = () => {
    if (formData.pickupDate && formData.dropoffDate) {
      const pickup = new Date(formData.pickupDate);
      const dropoff = new Date(formData.dropoffDate);
      const diffTime = dropoff.getTime() - pickup.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  const rentalDays = calculateRentalDays();
  const isValidRentalPeriod = rentalDays >= 2;

  const getLocationName = (locationName: string): string => {
    const locationMap: Record<string, Record<string, string>> = {
      'Ofisimizdən götürülmə': { az: 'Ofisimizdən götürülmə', en: 'Office pickup', ru: 'Получение из офиса' },
      'Heydər Əliyev Hava Limanı': { az: 'Heydər Əliyev Hava Limanı', en: 'Heydar Aliyev Airport', ru: 'Аэропорт Гейдара Алиева' },
      'Şəhər Mərkəzi': { az: 'Şəhər Mərkəzi', en: 'City Center', ru: 'Центр Города' },
      'Otel/Yaşayış yeri': { az: 'Otel/Yaşayış yeri', en: 'Hotel/Residence', ru: 'Отель/Место проживания' },
      'Dəmir yolu vağzalı': { az: 'Dəmir yolu vağzalı', en: 'Railway Station', ru: 'Железнодорожный Вокзал' },
    };
    return locationMap[locationName]?.[currentLang] || locationName;
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMinDropoffDate = () => {
    if (formData.pickupDate) {
      const pickup = new Date(formData.pickupDate);
      pickup.setDate(pickup.getDate() + 1); // Minimum 1 day after pickup
      return pickup.toISOString().split('T')[0];
    }
    return getTodayDate();
  };

  return (
    <div className="space-y-6" onKeyDown={handleKeyDown}>
      {/* Car Information */}
      {car && (
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800">
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-20 h-16 sm:w-24 sm:h-20 relative overflow-hidden rounded-lg flex-shrink-0">
                <img
                  src={car.image}
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg sm:text-xl text-amber-800 dark:text-amber-200 truncate">
                  {car.brand} {car.model}
                </h3>
                <p className="text-amber-700 dark:text-amber-300 text-sm sm:text-base">{car.year} • {car.class}</p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs">{car.fuelType}</Badge>
                  <Badge variant="secondary" className="text-xs">{car.transmission}</Badge>
                  <Badge variant="secondary" className="text-xs">{car.seats} {t.seats}</Badge>
                </div>
              </div>
              <div className="text-left sm:text-right self-start sm:self-center">
                <p className="text-xl sm:text-2xl font-bold text-amber-600">${car.dailyPrice}</p>
                <p className="text-xs sm:text-sm text-amber-700 dark:text-amber-300">{t.perDay}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Date Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {t.rentalPeriod}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pickupDate" className="flex items-center gap-2 text-sm sm:text-base">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                {t.pickupDate} *
              </Label>
              <Input
                id="pickupDate"
                type="date"
                value={formData.pickupDate || ''}
                onChange={(e) => handleInputChange('pickupDate', e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === ' ') {
                    e.preventDefault();
                  }
                }}
                min={getTodayDate()}
                className={`${errors.pickupDate ? 'border-red-500' : ''} text-base`}
              />
              {errors.pickupDate && (
                <p className="text-sm text-red-600">{errors.pickupDate}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dropoffDate" className="flex items-center gap-2 text-sm sm:text-base">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                {t.dropoffDate} *
              </Label>
              <Input
                id="dropoffDate"
                type="date"
                value={formData.dropoffDate || ''}
                onChange={(e) => handleInputChange('dropoffDate', e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === ' ') {
                    e.preventDefault();
                  }
                }}
                min={getMinDropoffDate()}
                className={`${errors.dropoffDate ? 'border-red-500' : ''} text-base`}
              />
              {errors.dropoffDate && (
                <p className="text-sm text-red-600">{errors.dropoffDate}</p>
              )}
            </div>
          </div>

          {/* Rental Period Display */}
          {rentalDays > 0 && (
            <div className={`p-4 rounded-lg ${
              isValidRentalPeriod 
                ? 'bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                : 'bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800'
            }`}>
              <div className="flex items-center gap-2">
                {isValidRentalPeriod ? (
                  <Clock className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <span className={`font-medium ${
                  isValidRentalPeriod ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
                }`}>
                  {t.rentalPeriod}: {rentalDays} {t.days}
                </span>
              </div>
              {!isValidRentalPeriod && (
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  {t.minimumRentalPeriod}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Location Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Götürülmə və Qaytarılma Yerləri
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm sm:text-base">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                {t.pickupLocation} *
              </Label>
              <Select 
                value={formData.pickupLocation || ''} 
                onValueChange={(value) => handleInputChange('pickupLocation', value)}
              >
                <SelectTrigger className={`${errors.pickupLocation ? 'border-red-500' : ''} text-base min-h-[2.75rem]`}>
                  <SelectValue placeholder={t.selectLocation} />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(location => (
                    <SelectItem key={location.id} value={location.id}>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-1">
                        <span className="text-sm sm:text-base">{getLocationName(location.name)}</span>
                        {location.extraCharge > 0 && (
                          <Badge variant="secondary" className="text-xs self-start sm:ml-2">
                            +${location.extraCharge}
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.pickupLocation && (
                <p className="text-sm text-red-600">{errors.pickupLocation}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm sm:text-base">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                {t.dropoffLocation} *
              </Label>
              <Select 
                value={formData.dropoffLocation || ''} 
                onValueChange={(value) => handleInputChange('dropoffLocation', value)}
              >
                <SelectTrigger className={`${errors.dropoffLocation ? 'border-red-500' : ''} text-base min-h-[2.75rem]`}>
                  <SelectValue placeholder={t.selectLocation} />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(location => (
                    <SelectItem key={location.id} value={location.id}>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-1">
                        <span className="text-sm sm:text-base">{getLocationName(location.name)}</span>
                        {location.extraCharge > 0 && (
                          <Badge variant="secondary" className="text-xs self-start sm:ml-2">
                            +${location.extraCharge}
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.dropoffLocation && (
                <p className="text-sm text-red-600">{errors.dropoffLocation}</p>
              )}
            </div>
          </div>

          {/* Location Charges Info */}
          {(formData.pickupLocation || formData.dropoffLocation) && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Bəzi yerlər üçün əlavə haqqı tətbiq edilir. Qiymət hesablamasında daxil ediləcək.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}