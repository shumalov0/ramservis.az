'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Car, 
  CreditCard, 
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  DollarSign
} from 'lucide-react';
import { BookingFormData, EnhancedCar } from '@/lib/types';
import { locations, additionalServices } from '@/lib/data';
import { useTranslation } from '@/lib/translations';

interface BookingSummaryProps {
  formData: Partial<BookingFormData>;
  car: EnhancedCar | null;
  priceBreakdown: {
    days: number;
    basePrice: number;
    locationCharges: number;
    serviceCharges: number;
    total: number;
    deposit: number;
  };
  currentLang: string;
  onEdit?: (section: string) => void;
  onConfirm?: () => void;
  isSubmitting?: boolean;
  showActions?: boolean;
}

export default function BookingSummary({
  formData,
  car,
  priceBreakdown,
  currentLang,
  onEdit,
  onConfirm,
  isSubmitting = false,
  showActions = true
}: BookingSummaryProps) {
  const t = useTranslation(currentLang);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
 
  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const getLocationName = (locationId: string) => {
    const location = locations.find(l => l.id === locationId);
    return location?.name || locationId;
  };

  const getServiceName = (serviceId: string) => {
    const service = additionalServices.find(s => s.id === serviceId);
    return service?.name || serviceId;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    if (currentLang === 'az') {
      const months = [
        'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
        'iyul', 'avqust', 'sentyabr', 'oktyabr', 'noyabr', 'dekabr'
      ];
      const weekdays = ['Bazar', 'Bazar ertəsi', 'Çərşənbə axşamı', 'Çərşənbə', 'Cümə axşamı', 'Cümə', 'Şənbə'];
      return `${weekdays[date.getDay()]}, ${day} ${months[date.getMonth()]} ${year}`;
    }
    
    return `${day}/${month}/${year}`;
  };

  const isFormComplete = () => {
    return formData.firstName && 
           formData.lastName && 
           formData.email && 
           formData.phone && 
           formData.pickupDate && 
           formData.dropoffDate && 
           formData.pickupLocation && 
           formData.dropoffLocation &&
           priceBreakdown.days >= 2;
  };

  return (
    <div className="space-y-6">
      {/* Header with Form Status */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
            <FileText className="h-5 w-5" />
            Rezervasiya Xülasəsi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              {isFormComplete() ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-green-700 dark:text-green-300">
                    Göndərilməyə hazırdır
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <span className="text-amber-700 dark:text-amber-300">
                    Bütün sahələri doldurun
                  </span>
                </>
              )}
            </div>
            
            {/* Form Completion Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                <span>Tamamlanma dərəcəsi</span>
                <span>
                  {Math.round(
                    (Object.values({
                      personal: formData.firstName && formData.lastName && formData.email && formData.phone,
                      rental: formData.pickupDate && formData.dropoffDate && formData.pickupLocation && formData.dropoffLocation,
                      payment: formData.paymentMethod,
                      car: car
                    }).filter(Boolean).length / 4) * 100
                  )}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-slate-700">
                <div 
                  className="bg-amber-600 h-2 rounded-full transition-all duration-300" 
                  style={{ 
                    width: `${Math.round(
                      (Object.values({
                        personal: formData.firstName && formData.lastName && formData.email && formData.phone,
                        rental: formData.pickupDate && formData.dropoffDate && formData.pickupLocation && formData.dropoffLocation,
                        payment: formData.paymentMethod,
                        car: car
                      }).filter(Boolean).length / 4) * 100
                    )}%` 
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader className="cursor-pointer" onClick={() => toggleSection('personal')}>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {t.personalInfo}
            </div>
            <div className="flex items-center gap-2">
              {formData.firstName && formData.lastName && formData.email && formData.phone ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-600" />
              )}
              {onEdit && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit('personal');
                  }}
                >
                  Düzəliş et
                </Button>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        {(expandedSection === 'personal' || expandedSection === null) && (
          <CardContent className="space-y-3">
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <User className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Ad Soyad:</span>
                </div>
                <span className="font-medium text-sm sm:text-base break-words">
                  {formData.firstName && formData.lastName 
                    ? `${formData.firstName} ${formData.lastName}`
                    : <span className="text-amber-600">Təqdim edilməyib</span>
                  }
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{t.email}:</span>
                </div>
                <span className="font-medium text-sm sm:text-base break-all">
                  {formData.email || <span className="text-amber-600">Təqdim edilməyib</span>}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{t.phone}:</span>
                </div>
                <span className="font-medium text-sm sm:text-base">
                  {formData.phone || <span className="text-amber-600">Təqdim edilməyib</span>}
                </span>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Car Information */}
      <Card>
        <CardHeader className="cursor-pointer" onClick={() => toggleSection('car')}>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Seçilmiş Avtomobil
            </div>
            <div className="flex items-center gap-2">
              {car ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-600" />
              )}
              {onEdit && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit('car');
                  }}
                >
                  Dəyişdir
                </Button>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        {(expandedSection === 'car' || expandedSection === null) && (
          <CardContent>
            {car ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-20 h-16 sm:w-24 sm:h-20 relative overflow-hidden rounded-lg flex-shrink-0">
                  <img
                    src={car.image}
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base sm:text-lg truncate">{car.brand} {car.model}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{car.year} • {car.class}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">{car.fuelType}</Badge>
                    <Badge variant="secondary" className="text-xs">{car.transmission}</Badge>
                    <Badge variant="secondary" className="text-xs">{car.seats} {t.seats}</Badge>
                  </div>
                </div>
                <div className="text-left sm:text-right self-start sm:self-center">
                  <p className="text-xl sm:text-2xl font-bold text-amber-600">₼{car.dailyPrice}</p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{t.perDay}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Car className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Avtomobil seçilməyib</p>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Rental Details */}
      <Card>
        <CardHeader className="cursor-pointer" onClick={() => toggleSection('rental')}>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {t.rentalDetails}
            </div>
            <div className="flex items-center gap-2">
              {formData.pickupDate && formData.dropoffDate && formData.pickupLocation && formData.dropoffLocation ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-600" />
              )}
              {onEdit && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit('rental');
                  }}
                >
                  Düzəliş et
                </Button>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        {(expandedSection === 'rental' || expandedSection === null) && (
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{t.pickupDate}:</span>
                </div>
                <p className="font-medium ml-6 text-sm sm:text-base break-words">
                  {formData.pickupDate 
                    ? formatDate(formData.pickupDate)
                    : <span className="text-amber-600">Seçilməyib</span>
                  }
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{t.dropoffDate}:</span>
                </div>
                <p className="font-medium ml-6 text-sm sm:text-base break-words">
                  {formData.dropoffDate 
                    ? formatDate(formData.dropoffDate)
                    : <span className="text-amber-600">Seçilməyib</span>
                  }
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{t.pickupLocation}:</span>
                </div>
                <p className="font-medium ml-6 text-sm sm:text-base break-words">
                  {formData.pickupLocation 
                    ? getLocationName(formData.pickupLocation)
                    : <span className="text-amber-600">Seçilməyib</span>
                  }
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{t.dropoffLocation}:</span>
                </div>
                <p className="font-medium ml-6 text-sm sm:text-base break-words">
                  {formData.dropoffLocation 
                    ? getLocationName(formData.dropoffLocation)
                    : <span className="text-amber-600">Seçilməyib</span>
                  }
                </p>
              </div>
            </div>
            
            {priceBreakdown.days > 0 && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-blue-800 dark:text-blue-200">
                  {t.rentalPeriod}: <strong>{priceBreakdown.days} {t.days}</strong>
                </span>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Additional Services */}
      {formData.additionalServices && formData.additionalServices.length > 0 && (
        <Card>
          <CardHeader className="cursor-pointer" onClick={() => toggleSection('services')}>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {t.additionalServices}
              </div>
              {onEdit && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit('services');
                  }}
                >
                  Düzəliş et
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          {(expandedSection === 'services' || expandedSection === null) && (
            <CardContent>
              <div className="space-y-2">
                {formData.additionalServices.map((serviceId) => (
                  <div key={serviceId} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-[#1a1a1a] rounded">
                    <span>{getServiceName(serviceId)}</span>
                    <Badge variant="secondary">
                      ₼{additionalServices.find(s => s.id === serviceId)?.price || 0}/gün
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Payment Method */}
      <Card>
        <CardHeader className="cursor-pointer" onClick={() => toggleSection('payment')}>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              {t.paymentMethod}
            </div>
            <div className="flex items-center gap-2">
              {formData.paymentMethod ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-600" />
              )}
              {onEdit && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit('payment');
                  }}
                >
                  Düzəliş et
                </Button>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        {(expandedSection === 'payment' || expandedSection === null) && (
          <CardContent>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-gray-500" />
              <span className="font-medium">
                {formData.paymentMethod === 'online' 
                  ? t.onlinePayment
                  : formData.paymentMethod === 'cash'
                  ? t.cashPayment
                  : <span className="text-amber-600">Seçilməyib</span>
                }
              </span>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Enhanced Price Summary */}
      {priceBreakdown.days >= 2 && (
        <Card className="border-2 border-amber-200 dark:border-amber-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
              <DollarSign className="h-5 w-5" />
              {t.priceSummary}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Rental Period Summary */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-blue-800 dark:text-blue-200 font-medium">
                  İcarə müddəti:
                </span>
                <span className="text-blue-900 dark:text-blue-100 font-bold">
                  {priceBreakdown.days} gün
                </span>
              </div>
              {car && (
                <div className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  ₼{car.dailyPrice}/gün × {priceBreakdown.days} gün
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>{t.basePrice}:</span>
                <span className="font-semibold">₼{priceBreakdown.basePrice}</span>
              </div>
              
              {priceBreakdown.locationCharges > 0 && (
                <div className="flex justify-between">
                  <span>{t.locationChanges}:</span>
                  <span className="font-semibold">₼{priceBreakdown.locationCharges}</span>
                </div>
              )}
              
              {priceBreakdown.serviceCharges > 0 && (
                <div className="flex justify-between">
                  <span>{t.additionalServicesPrice}:</span>
                  <span className="font-semibold">₼{priceBreakdown.serviceCharges}</span>
                </div>
              )}
              
              {/* Tax/Fee Information */}
              <div className="text-xs text-gray-500 dark:text-gray-400 pt-1">
                * Bütün qiymətlər AZN-lə göstərilir və vergi daxildir
              </div>
            </div>

            <Separator />
            
            {/* Total Amount */}
            <div className="space-y-2">
              <div className="flex justify-between text-lg">
                <span className="font-bold">{t.totalAmount}:</span>
                <span className="font-bold text-amber-600">₼{priceBreakdown.total}</span>
              </div>
              
              <div className="flex justify-between text-red-600 dark:text-red-400">
                <span className="font-semibold">{t.deposit}:</span>
                <span className="font-semibold">₼{priceBreakdown.deposit}</span>
              </div>
              
              {/* Payment Amount */}
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-green-800 dark:text-green-200 font-medium">
                    {formData.paymentMethod === 'online' ? 'Onlayn ödəniş:' : 'Nağd ödəniş:'}
                  </span>
                  <span className="text-green-900 dark:text-green-100 font-bold text-lg">
                    ₼{priceBreakdown.total - priceBreakdown.deposit}
                  </span>
                </div>
                <div className="text-xs text-green-700 dark:text-green-300 mt-1">
                  {formData.paymentMethod === 'online' 
                    ? 'İndi ödəniləcək məbləğ (depozit çıxılmaqla)'
                    : 'Avtomobil götürərkən ödəniləcək məbləğ'
                  }
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Complete Form Data Display */}
      <Card>
        <CardHeader className="cursor-pointer" onClick={() => toggleSection('complete')}>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Tam Rezervasiya Məlumatları
            </div>
            <div className="text-sm text-gray-500">
              {expandedSection === 'complete' ? 'Gizlə' : 'Göstər'}
            </div>
          </CardTitle>
        </CardHeader>
        {expandedSection === 'complete' && (
          <CardContent className="space-y-6">
            {/* All Form Inputs Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-white border-b pb-1">
                  Şəxsi Məlumatlar
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Ad:</span>
                    <span className="font-medium">{formData.firstName || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Soyad:</span>
                    <span className="font-medium">{formData.lastName || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">E-mail:</span>
                    <span className="font-medium">{formData.email || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Telefon:</span>
                    <span className="font-medium">{formData.phone || '-'}</span>
                  </div>
                </div>
              </div>

              {/* Rental Details */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-white border-b pb-1">
                  İcarə Təfərrüatları
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Götürülmə:</span>
                    <span className="font-medium">
                      {formData.pickupDate ? formatDate(formData.pickupDate) : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Qaytarılma:</span>
                    <span className="font-medium">
                      {formData.dropoffDate ? formatDate(formData.dropoffDate) : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Götürülmə yeri:</span>
                    <span className="font-medium">{getLocationName(formData.pickupLocation || '') || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Qaytarılma yeri:</span>
                    <span className="font-medium">{getLocationName(formData.dropoffLocation || '') || '-'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Services */}
            {formData.additionalServices && formData.additionalServices.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-white border-b pb-1">
                  Əlavə Xidmətlər
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {formData.additionalServices.map((serviceId) => {
                    const service = additionalServices.find(s => s.id === serviceId);
                    return (
                      <div key={serviceId} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-[#1a1a1a] rounded text-sm">
                        <span>{service?.name || serviceId}</span>
                        <Badge variant="secondary">
                          ₼{service?.price || 0}/gün
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Payment Information */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 dark:text-white border-b pb-1">
                Ödəniş Məlumatları
              </h4>
              <div className="bg-gray-50 dark:bg-slate-800 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Ödəniş üsulu:</span>
                  <Badge variant={formData.paymentMethod === 'online' ? 'default' : 'secondary'}>
                    {formData.paymentMethod === 'online' ? 'Onlayn ödəniş' : 'Nağd ödəniş'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Special Requests */}
            {formData.specialRequests && (
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-white border-b pb-1">
                  Xüsusi İstəklər
                </h4>
                <div className="bg-gray-50 dark:bg-[#1a1a1a] p-3 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-sm">
                    {formData.specialRequests}
                  </p>
                </div>
              </div>
            )}

            {/* Form Metadata */}
            <div className="border-t pt-4">
              <div className="grid grid-cols-2 gap-4 text-xs text-gray-500 dark:text-gray-400">
                <div>
                  <span className="font-medium">Form ID:</span> {formData.carId || 'general'}
                </div>
                <div>
                  <span className="font-medium">Yaradılma tarixi:</span> {new Date().toLocaleString()}
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Action Buttons */}
      {showActions && (
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
          {onEdit && (
            <Button 
              variant="outline" 
              onClick={() => onEdit('review')}
              className="w-full sm:flex-1 text-sm sm:text-base"
            >
              Yoxla və Düzəliş et
            </Button>
          )}
          {onConfirm && (
            <Button 
              onClick={onConfirm}
              disabled={!isFormComplete() || isSubmitting}
              className="w-full sm:flex-1 bg-amber-600 hover:bg-amber-700 text-sm sm:text-base"
            >
              {isSubmitting 
                ? 'Göndərilir...'
                : formData.paymentMethod === 'online' 
                ? 'Ödənişə keç'
                : 'Rezervasiyanı təsdiq et'
              }
            </Button>
          )}
        </div>
      )}
    </div>
  );
}