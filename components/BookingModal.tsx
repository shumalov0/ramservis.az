'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Calendar, MapPin, User, Mail, Phone, CreditCard, MessageCircle } from 'lucide-react';
import { Car, locations, additionalServices } from '@/lib/data';
import { useTranslation } from '@/lib/translations';

interface BookingModalProps {
  car: Car;
  currentLang: string;
  onClose: () => void;
}

interface BookingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  pickupDate: string;
  dropoffDate: string;
  pickupLocation: string;
  dropoffLocation: string;
  additionalServices: string[];
  paymentMethod: 'online' | 'cash';
}

export default function BookingModal({ car, currentLang, onClose }: BookingModalProps) {
  const t = useTranslation(currentLang);
  const [formData, setFormData] = useState<BookingData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    pickupDate: '',
    dropoffDate: '',
    pickupLocation: '',
    dropoffLocation: '',
    additionalServices: [],
    paymentMethod: 'cash'
  });

  const [pricing, setPricing] = useState({
    days: 0,
    basePrice: 0,
    locationCharges: 0,
    serviceCharges: 0,
    total: 0,
    deposit: car.deposit
  });

  // Calculate pricing
  useEffect(() => {
    if (formData.pickupDate && formData.dropoffDate) {
      const pickup = new Date(formData.pickupDate);
      const dropoff = new Date(formData.dropoffDate);
      const timeDiff = dropoff.getTime() - pickup.getTime();
      const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      if (days >= 2) {
        let dailyRate = car.dailyPrice;
        let basePrice = 0;

        // Calculate base price based on rental period
        if (days >= 30) {
          const months = Math.floor(days / 30);
          const remainingDays = days % 30;
          basePrice = (months * car.monthlyPrice) + (remainingDays * car.dailyPrice);
        } else if (days >= 7) {
          const weeks = Math.floor(days / 7);
          const remainingDays = days % 7;
          basePrice = (weeks * car.weeklyPrice) + (remainingDays * car.dailyPrice);
        } else {
          basePrice = days * car.dailyPrice;
        }

        // Calculate location charges
        const pickupLocation = locations.find(l => l.id === formData.pickupLocation);
        const dropoffLocation = locations.find(l => l.id === formData.dropoffLocation);
        const locationCharges = (pickupLocation?.extraCharge || 0) + (dropoffLocation?.extraCharge || 0);

        // Calculate service charges
        const serviceCharges = formData.additionalServices.reduce((total, serviceId) => {
          const service = additionalServices.find(s => s.id === serviceId);
          return total + (service ? service.price * days : 0);
        }, 0);

        const total = basePrice + locationCharges + serviceCharges;

        setPricing({
          days,
          basePrice,
          locationCharges,
          serviceCharges,
          total,
          deposit: car.deposit
        });
      }
    }
  }, [formData.pickupDate, formData.dropoffDate, formData.pickupLocation, formData.dropoffLocation, formData.additionalServices, car]);

  const handleInputChange = (field: keyof BookingData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleServiceChange = (serviceId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      additionalServices: checked 
        ? [...prev.additionalServices, serviceId]
        : prev.additionalServices.filter(id => id !== serviceId)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare booking details
    const bookingDetails = {
      car: `${car.brand} ${car.model} (${car.year})`,
      customer: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      pickupDate: formData.pickupDate,
      dropoffDate: formData.dropoffDate,
      pickupLocation: locations.find(l => l.id === formData.pickupLocation)?.name || '',
      dropoffLocation: locations.find(l => l.id === formData.dropoffLocation)?.name || '',
      additionalServices: formData.additionalServices.map(id => 
        additionalServices.find(s => s.id === id)?.name || ''
      ),
      pricing,
      paymentMethod: formData.paymentMethod
    };

    // Save to localStorage
    const existingBookings = JSON.parse(localStorage.getItem('ramservis_bookings') || '[]');
    const newBooking = {
      ...bookingDetails,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    existingBookings.push(newBooking);
    localStorage.setItem('ramservis_bookings', JSON.stringify(existingBookings));

    // Simulate email sending (in real app, this would be handled by backend)
    console.log('Email sent to customer:', formData.email);
    console.log('Email sent to business:', 'info@ramservis.az');
    console.log('Booking details:', bookingDetails);

    if (formData.paymentMethod === 'online') {
      // Send WhatsApp message for online payment
      const message = `Yeni rezervasiya:\n\nMüştəri: ${formData.firstName} ${formData.lastName}\nMaşın: ${car.brand} ${car.model}\nTarix: ${formData.pickupDate} - ${formData.dropoffDate}\nÜmumi məbləğ: ₼${pricing.total}\n\nOnline ödəniş üçün kart məlumatlarını göndərin.`;
      const whatsappUrl = `https://wa.me/+994707004444?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }

    alert('Rezervasiyanız uğurla göndərildi! E-mail ünvanınıza təsdiq göndəriləcək.');
    onClose();
  };

  const isFormValid = formData.firstName && formData.lastName && formData.email && formData.phone && 
                     formData.pickupDate && formData.dropoffDate && formData.pickupLocation && 
                     formData.dropoffLocation && pricing.days >= 2;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-modal">
      <div className="bg-white dark:bg-brand-dark rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{t.onlineReservation}</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">{car.brand} {car.model} ({car.year})</p>
          </div>
          <Button variant="ghost" onClick={onClose} className="shrink-0">
            <X className="h-6 w-6" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6 sm:space-y-8">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>{t.personalInfo}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">{t.firstName} *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">{t.lastName} *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">{t.email} *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">{t.phone} *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Rental Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>{t.rentalDetails}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pickupDate">{t.pickupDate} *</Label>
                  <Input
                    id="pickupDate"
                    type="date"
                    value={formData.pickupDate}
                    onChange={(e) => handleInputChange('pickupDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="dropoffDate">{t.dropoffDate} *</Label>
                  <Input
                    id="dropoffDate"
                    type="date"
                    value={formData.dropoffDate}
                    onChange={(e) => handleInputChange('dropoffDate', e.target.value)}
                    min={formData.pickupDate || new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
              </div>

              {pricing.days > 0 && pricing.days < 2 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 text-sm">
                    {t.minimumRentalPeriod}: {pricing.days} {t.days}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>{t.pickupLocation} *</Label>
                  <Select onValueChange={(value) => handleInputChange('pickupLocation', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={t.selectLocation} />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map(location => (
                        <SelectItem key={location.id} value={location.id}>
                          <div className="flex justify-between items-center w-full">
                            <span>{getLocalizedLocationName(location.name)}</span>
                            {location.extraCharge > 0 && (
                              <Badge variant="secondary" className="ml-2">
                                +₼{location.extraCharge}
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{t.dropoffLocation} *</Label>
                  <Select onValueChange={(value) => handleInputChange('dropoffLocation', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={t.selectLocation} />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map(location => (
                        <SelectItem key={location.id} value={location.id}>
                          <div className="flex justify-between items-center w-full">
                            <span>{getLocalizedLocationName(location.name)}</span>
                            {location.extraCharge > 0 && (
                              <Badge variant="secondary" className="ml-2">
                                +₼{location.extraCharge}
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Services */}
          <Card>
            <CardHeader>
              <CardTitle>{t.additionalServices}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {additionalServices.map(service => (
                <div key={service.id} className="flex items-start space-x-3">
                  <Checkbox
                    id={service.id}
                    checked={formData.additionalServices.includes(service.id)}
                    onCheckedChange={(checked) => handleServiceChange(service.id, checked as boolean)}
                  />
                  <div className="flex-1">
                    <Label htmlFor={service.id} className="text-base font-medium cursor-pointer">
                      {getLocalizedServiceName(service.name)}
                    </Label>
                    <p className="text-sm text-gray-600">{getLocalizedServiceDescription(service.description)}</p>
                    <p className="text-sm font-semibold text-brand-gold">₼{service.price}/{t.perDay.replace('/', '')}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>{t.paymentMethod}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={formData.paymentMethod} 
                onValueChange={(value) => handleInputChange('paymentMethod', value)}
                className="space-y-3"
              >
                <div className="flex items-start space-x-3 p-3 border rounded-lg">
                  <RadioGroupItem value="cash" id="cash" className="mt-0.5" />
                  <div className="flex-1">
                    <Label htmlFor="cash" className="font-medium cursor-pointer">{t.cashPayment}</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Avtomobili götürərkən nəğd ödəniş. Depozit: {car.deposit}₼
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 border rounded-lg">
                  <RadioGroupItem value="online" id="online" className="mt-0.5" />
                  <div className="flex-1">
                    <Label htmlFor="online" className="font-medium cursor-pointer">{t.onlinePayment}</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Kart və ya bank köçürməsi ilə ödəniş. Depozit: {car.deposit}₼
                    </p>
                    <div className="mt-2 p-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-md">
                      <p className="text-xs text-orange-700 dark:text-orange-300 font-medium">
                        ⚠️ Diqqət: Kartla ödənişdə 18% ƏDV + 18% kart komissiyası tətbiq olunur
                      </p>
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Price Summary */}
          {pricing.days >= 2 && (
            <Card>
              <CardHeader>
                <CardTitle>{t.priceSummary}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>{t.rentalPeriod}:</span>
                  <span className="font-semibold">{pricing.days} {t.days}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.basePrice}:</span>
                  <span className="font-semibold">₼{pricing.basePrice}</span>
                </div>
                {pricing.locationCharges > 0 && (
                  <div className="flex justify-between">
                    <span>{t.locationChanges}:</span>
                    <span className="font-semibold">₼{pricing.locationCharges}</span>
                  </div>
                )}
                {pricing.serviceCharges > 0 && (
                  <div className="flex justify-between">
                    <span>{t.additionalServicesPrice}:</span>
                    <span className="font-semibold">₼{pricing.serviceCharges}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg">
                  <span className="font-bold">{t.totalAmount}:</span>
                  <span className="font-bold text-brand-gold">₼{pricing.total}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span className="font-semibold">{t.deposit}:</span>
                  <span className="font-semibold">₼{pricing.deposit}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <div className="flex space-x-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              {t.cancel}
            </Button>
            <Button 
              type="submit" 
              disabled={!isFormValid}
              className="flex-1 bg-amber-600 hover:bg-amber-700"
            >
              {formData.paymentMethod === 'online' ? t.onlinePayment : t.makeReservation}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );

  function getLocalizedLocationName(locationName: string): string {
    const locationMap: Record<string, Record<string, string>> = {
      'Ofisimizdən götürülmə': { az: 'Ofisimizdən götürülmə', en: 'Office pickup', ru: 'Получение из офиса' },
      'Heydər Əliyev Hava Limanı': { az: 'Heydər Əliyev Hava Limanı', en: 'Heydar Aliyev Airport', ru: 'Аэропорт Гейдара Алиева' },
      'Şəhər Mərkəzi': { az: 'Şəhər Mərkəzi', en: 'City Center', ru: 'Центр Города' },
      'Otel/Yaşayış yeri': { az: 'Otel/Yaşayış yeri', en: 'Hotel/Residence', ru: 'Отель/Место проживания' },
      'Dəmir yolu vağzalı': { az: 'Dəmir yolu vağzalı', en: 'Railway Station', ru: 'Железнодорожный Вокзал' },
    };
    return locationMap[locationName]?.[currentLang] || locationName;
  }

  function getLocalizedServiceName(serviceName: string): string {
    const serviceMap: Record<string, Record<string, string>> = {
      'Şəxsi Sürücü': { az: 'Şəxsi Sürücü', en: 'Personal Driver', ru: 'Личный Водитель' },
      'Uşaq Oturacağı': { az: 'Uşaq Oturacağı', en: 'Child Seat', ru: 'Детское Кресло' },
      'GPS Naviqasiya': { az: 'GPS Naviqasiya', en: 'GPS Navigation', ru: 'GPS Навигация' },
      'Tam Sığorta': { az: 'Tam Sığorta', en: 'Full Insurance', ru: 'Полная Страховка' },
    };
    return serviceMap[serviceName]?.[currentLang] || serviceName;
  }

  function getLocalizedServiceDescription(description: string): string {
    const descMap: Record<string, Record<string, string>> = {
      'Təcrübəli sürücü ilə rahat səyahət': { az: 'Təcrübəli sürücü ilə rahat səyahət', en: 'Comfortable travel with experienced driver', ru: 'Комфортное путешествие с опытным водителем' },
      '0-12 yaş arası uşaqlar üçün təhlükəsiz oturacaq': { az: '0-12 yaş arası uşaqlar üçün təhlükəsiz oturacaq', en: 'Safe seat for children aged 0-12', ru: 'Безопасное кресло для детей 0-12 лет' },
      'Peşəkar GPS cihazı': { az: 'Peşəkar GPS cihazı', en: 'Professional GPS device', ru: 'Профессиональное GPS устройство' },
      'Genişləndirilmiş sığorta təminatı': { az: 'Genişləndirilmiş sığorta təminatı', en: 'Extended insurance coverage', ru: 'Расширенное страховое покрытие' },
    };
    return descMap[description]?.[currentLang] || description;
  }
}