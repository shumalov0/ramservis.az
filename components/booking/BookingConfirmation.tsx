'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle,
  Calendar,
  MapPin,
  Car,
  User,
  Mail,
  Phone,
  CreditCard,
  Download,
  Share2,
  MessageCircle
} from 'lucide-react';
import { EnhancedCar, BookingFormData } from '@/lib/types';
import { PriceBreakdown } from '@/lib/price-calculation';
import { format } from 'date-fns';
import { az } from 'date-fns/locale';

interface BookingConfirmationProps {
  bookingData: BookingFormData;
  car: EnhancedCar;
  priceBreakdown: PriceBreakdown;
  confirmationNumber: string;
  onClose: () => void;
  onDownloadReceipt?: () => void;
  onShareBooking?: () => void;
  onContactSupport?: () => void;
}

export function BookingConfirmation({
  bookingData,
  car,
  priceBreakdown,
  confirmationNumber,
  onClose,
  onDownloadReceipt,
  onShareBooking,
  onContactSupport
}: BookingConfirmationProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('az-AZ', {
      style: 'currency',
      currency: 'AZN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMMM yyyy, EEEE', { locale: az });
  };

  const handleDownload = async () => {
    setIsProcessing(true);
    try {
      if (onDownloadReceipt) {
        await onDownloadReceipt();
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Success Header */}
      <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Rezervasiya Təsdiqləndi!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Rezervasiyanız uğurla qeydə alındı. Tezliklə sizinlə əlaqə saxlayacağıq.
          </p>
          <Badge variant="outline" className="text-lg px-4 py-2">
            #{confirmationNumber}
          </Badge>
        </CardContent>
      </Card>

      {/* Booking Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Rezervasiya Təfərrüatları
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Car Information */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-[#1a1a1a] rounded-lg">
            <div className="flex-1">
              <h3 className="font-semibold text-lg">
                {car.brand} {car.model}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {car.year} • {car.class} • {car.transmission}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary">{car.fuelType}</Badge>
                <Badge variant="secondary">{car.seats} nəfər</Badge>
              </div>
            </div>
          </div>

          {/* Rental Period */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Calendar className="h-4 w-4" />
                Götürülmə
              </div>
              <div className="pl-6">
                <p className="font-medium">{formatDate(bookingData.pickupDate)}</p>
                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="h-3 w-3" />
                  <span>{bookingData.pickupLocation}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Calendar className="h-4 w-4" />
                Qaytarılma
              </div>
              <div className="pl-6">
                <p className="font-medium">{formatDate(bookingData.dropoffDate)}</p>
                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="h-3 w-3" />
                  <span>{bookingData.dropoffLocation}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Customer Information */}
          <div>
            <h4 className="flex items-center gap-2 font-medium mb-3">
              <User className="h-4 w-4" />
              Müştəri Məlumatları
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Ad Soyad:</span>
                <p className="font-medium">{bookingData.firstName} {bookingData.lastName}</p>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Telefon:</span>
                <p className="font-medium">{bookingData.phone}</p>
              </div>
              <div className="sm:col-span-2">
                <span className="text-gray-600 dark:text-gray-400">E-mail:</span>
                <p className="font-medium">{bookingData.email}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Additional Services */}
          {bookingData.additionalServices && bookingData.additionalServices.length > 0 && (
            <>
              <div>
                <h4 className="font-medium mb-3">Əlavə Xidmətlər</h4>
                <div className="flex flex-wrap gap-2">
                  {bookingData.additionalServices.map((service, index) => (
                    <Badge key={index} variant="outline">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Special Requests */}
          {bookingData.specialRequests && (
            <>
              <div>
                <h4 className="font-medium mb-2">Xüsusi İstəklər</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-[#1a1a1a] p-3 rounded-lg">
                  {bookingData.specialRequests}
                </p>
              </div>
              <Separator />
            </>
          )}

          {/* Payment Information */}
          <div>
            <h4 className="flex items-center gap-2 font-medium mb-3">
              <CreditCard className="h-4 w-4" />
              Ödəniş Məlumatları
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Əsas qiymət:</span>
                <span className="font-medium">{formatPrice(priceBreakdown.basePrice)}</span>
              </div>
              
              {priceBreakdown.locationCharges > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Yer dəyişikliyi:</span>
                  <span className="font-medium">{formatPrice(priceBreakdown.locationCharges)}</span>
                </div>
              )}
              
              {priceBreakdown.serviceCharges > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Xidmət haqqı:</span>
                  <span className="font-medium">{formatPrice(priceBreakdown.serviceCharges)}</span>
                </div>
              )}

              <Separator />
              
              <div className="flex items-center justify-between font-semibold">
                <span>Ümumi məbləğ:</span>
                <span className="text-lg">{formatPrice(priceBreakdown.total)}</span>
              </div>
              
              {priceBreakdown.deposit > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Depozit:</span>
                  <span className="font-medium">{formatPrice(priceBreakdown.deposit)}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600 dark:text-gray-400">Ödəniş üsulu:</span>
                <Badge variant={bookingData.paymentMethod === 'online' ? 'default' : 'secondary'}>
                  {bookingData.paymentMethod === 'online' ? 'Onlayn ödəniş' : 'Nağd ödəniş'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Növbəti Addımlar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">1</span>
              </div>
              <div>
                <p className="font-medium">Təsdiq e-maili</p>
                <p className="text-gray-600 dark:text-gray-400">
                  Rezervasiya təfərrüatları ilə e-mail göndəriləcək
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">2</span>
              </div>
              <div>
                <p className="font-medium">Əlaqə</p>
                <p className="text-gray-600 dark:text-gray-400">
                  24 saat ərzində sizinlə əlaqə saxlayacağıq
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">3</span>
              </div>
              <div>
                <p className="font-medium">Avtomobil təhvili</p>
                <p className="text-gray-600 dark:text-gray-400">
                  Seçilmiş tarix və yerdə avtomobili təhvil alın
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleDownload}
          disabled={isProcessing}
          variant="outline"
          className="flex-1"
        >
          <Download className="h-4 w-4 mr-2" />
          {isProcessing ? 'Yüklənir...' : 'Qəbzi yüklə'}
        </Button>
        
        {onShareBooking && (
          <Button
            onClick={onShareBooking}
            variant="outline"
            className="flex-1"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Paylaş
          </Button>
        )}
        
        {onContactSupport && (
          <Button
            onClick={onContactSupport}
            variant="outline"
            className="flex-1"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Dəstək
          </Button>
        )}
        
        <Button
          onClick={onClose}
          className="flex-1 bg-amber-600 hover:bg-amber-700"
        >
          Bağla
        </Button>
      </div>
    </div>
  );
}