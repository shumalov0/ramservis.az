'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CreditCard, 
  FileText, 
  DollarSign,
  MessageSquare
} from 'lucide-react';
import { BookingFormData } from '@/lib/types';
import { additionalServices } from '@/lib/data';
import { useTranslation } from '@/lib/translations';

interface ServicesPaymentFormProps {
  formData: Partial<BookingFormData>;
  onUpdate: (updates: Partial<BookingFormData>) => void;
  currentLang: string;
  errors: Record<string, string>;
  priceBreakdown?: {
    days: number;
    basePrice: number;
    locationCharges: number;
    serviceCharges: number;
    total: number;
    deposit: number;
  };
}

export default function ServicesPaymentForm({
  formData,
  onUpdate,
  currentLang,
  errors,
  priceBreakdown
}: ServicesPaymentFormProps) {
  const t = useTranslation(currentLang);

  const handleServiceChange = (serviceId: string, checked: boolean) => {
    const currentServices = formData.additionalServices || [];
    const updatedServices = checked
      ? [...currentServices, serviceId]
      : currentServices.filter(id => id !== serviceId);
    
    onUpdate({ additionalServices: updatedServices });
  };

  const handlePaymentMethodChange = (value: string) => {
    onUpdate({ paymentMethod: value as 'cash' | 'online' });
  };

  const handleSpecialRequestsChange = (value: string) => {
    onUpdate({ specialRequests: value });
  };

  // Prevent space key from triggering unwanted actions on container
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Only prevent space if it's on the container div itself, not on input elements
    if (e.key === ' ' && e.target === e.currentTarget && e.currentTarget.tagName === 'DIV') {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const getServiceName = (serviceName: string): string => {
    const serviceMap: Record<string, Record<string, string>> = {
      'Şəxsi Sürücü': { az: 'Şəxsi Sürücü', en: 'Personal Driver', ru: 'Личный Водитель' },
      'Uşaq Oturacağı': { az: 'Uşaq Oturacağı', en: 'Child Seat', ru: 'Детское Кресло' },
      'GPS Naviqasiya': { az: 'GPS Naviqasiya', en: 'GPS Navigation', ru: 'GPS Навигация' },
      'Tam Sığorta': { az: 'Tam Sığorta', en: 'Full Insurance', ru: 'Полная Страховка' },
    };
    return serviceMap[serviceName]?.[currentLang] || serviceName;
  };

  const getServiceDescription = (description: string): string => {
    const descMap: Record<string, Record<string, string>> = {
      'Təcrübəli sürücü ilə rahat səyahət': { az: 'Təcrübəli sürücü ilə rahat səyahət', en: 'Comfortable travel with experienced driver', ru: 'Комфортное путешествие с опытным водителем' },
      '0-12 yaş arası uşaqlar üçün təhlükəsiz oturacaq': { az: '0-12 yaş arası uşaqlar üçün təhlükəsiz oturacaq', en: 'Safe seat for children aged 0-12', ru: 'Безопасное кресло для детей 0-12 лет' },
      'Peşəkar GPS cihazı': { az: 'Peşəkar GPS cihazı', en: 'Professional GPS device', ru: 'Профессиональное GPS устройство' },
      'Genişləndirilmiş sığorta təminatı': { az: 'Genişləndirilmiş sığorta təminatı', en: 'Extended insurance coverage', ru: 'Расширенное страховое покрытие' },
    };
    return descMap[description]?.[currentLang] || description;
  };

  return (
    <div className="space-y-6" onKeyDown={handleKeyDown}>
      {/* Additional Services */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {t.additionalServices}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {additionalServices.map(service => (
              <div 
                key={service.id} 
                className="flex items-start space-x-3 p-3 sm:p-4 border rounded-lg hover:bg-amber-50/50 dark:hover:bg-amber-900/10 transition-colors"
              >
                <div className="flex items-center h-5 mt-0.5">
                  <Checkbox
                    id={`service-${service.id}`}
                    checked={formData.additionalServices?.includes(service.id) || false}
                    onCheckedChange={(checked) => handleServiceChange(service.id, checked as boolean)}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Label 
                    htmlFor={`service-${service.id}`} 
                    className="text-sm sm:text-base font-medium cursor-pointer block"
                  >
                    {getServiceName(service.name)}
                  </Label>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                    {getServiceDescription(service.description)}
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs text-amber-700 bg-amber-100 dark:bg-amber-900/30 self-start">
                      {service.price} ₼/{t.perDay?.replace('/', '') || 'gün'}
                    </Badge>
                    {priceBreakdown && priceBreakdown.days > 0 && (
                      <span className="text-xs sm:text-sm text-gray-500">
                        (Ümumi: {service.price * priceBreakdown.days} ₼)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {formData.additionalServices && formData.additionalServices.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Əlavə xidmət seçilməyib</p>
              <p className="text-sm mt-1">İstəsəniz yuxarıdakı xidmətlərdən seçə bilərsiniz</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            {t.paymentMethod}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={formData.paymentMethod || 'cash'} 
            onValueChange={handlePaymentMethodChange}
            className="grid grid-cols-1 gap-4"
          >
            <div className="flex items-start space-x-3 p-3 sm:p-4 border rounded-lg hover:bg-amber-50/50 dark:hover:bg-amber-900/10 transition-colors">
              <RadioGroupItem value="cash" id="cash" className="h-5 w-5 mt-0.5" />
              <div className="flex-1 min-w-0">
                <Label htmlFor="cash" className="text-sm sm:text-base font-medium cursor-pointer block">
                  {t.cashPayment}
                </Label>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                  Avtomobili götürərkən nəğd ödəniş edin. Depozit: {priceBreakdown ? `${priceBreakdown.deposit}₼` : 'Təyin ediləcək'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 sm:p-4 border rounded-lg hover:bg-amber-50/50 dark:hover:bg-amber-900/10 transition-colors">
              <RadioGroupItem value="online" id="online" className="h-5 w-5 mt-0.5" />
              <div className="flex-1 min-w-0">
                <Label htmlFor="online" className="text-sm sm:text-base font-medium cursor-pointer block">
                  {t.onlinePayment}
                </Label>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                  Kart və ya bank köçürməsi ilə ödəniş. Depozit: {priceBreakdown ? `${priceBreakdown.deposit}₼` : 'Təyin ediləcək'}
                </p>
                <div className="mt-2 p-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-md">
                  <p className="text-xs text-orange-700 dark:text-orange-300 font-medium">
                    ⚠️ Diqqət: Kartla ödənişdə 18% ƏDV tətbiq olunur
                  </p>
                </div>
              </div>
            </div>
          </RadioGroup>

          {errors.paymentMethod && (
            <p className="text-sm text-red-600 mt-2">{errors.paymentMethod}</p>
          )}
        </CardContent>
      </Card>

      {/* Special Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Xüsusi İstəklər
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="specialRequests">
              Əlavə istəkləriniz varsa qeyd edin (ixtiyari)
            </Label>
            <Textarea
              id="specialRequests"
              value={formData.specialRequests || ''}
              onChange={(e) => handleSpecialRequestsChange(e.target.value)}
              onKeyDown={(e) => {
                // Allow space in textarea for normal text input
                if (e.key === ' ' && e.target === e.currentTarget) {
                  e.stopPropagation();
                }
              }}
              placeholder="Məsələn: Uşaq oturacağı, xüsusi təlimatlar və s."
              rows={4}
              maxLength={500}
              className={`${errors.specialRequests ? 'border-red-500' : ''} text-base resize-none`}
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>
                {errors.specialRequests && (
                  <span className="text-red-600">{errors.specialRequests}</span>
                )}
              </span>
              <span>
                {(formData.specialRequests || '').length}/500
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price Preview */}
      {priceBreakdown && priceBreakdown.days >= 2 && (
        <Card className="border-2 border-amber-200 dark:border-amber-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
              <DollarSign className="h-5 w-5" />
              Qiymət Önizləməsi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>{t.rentalPeriod}:</span>
              <span className="font-semibold">{priceBreakdown.days} {t.days}</span>
            </div>
            <div className="flex justify-between">
              <span>{t.basePrice}:</span>
              <span className="font-semibold">{priceBreakdown.basePrice} ₼</span>
            </div>
            {priceBreakdown.locationCharges > 0 && (
              <div className="flex justify-between">
                <span>{t.locationChanges}:</span>
                <span className="font-semibold">{priceBreakdown.locationCharges} ₼</span>
              </div>
            )}
            {priceBreakdown.serviceCharges > 0 && (
              <div className="flex justify-between">
                <span>{t.additionalServicesPrice}:</span>
                <span className="font-semibold">{priceBreakdown.serviceCharges} ₼</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-lg">
              <span className="font-bold">{t.totalAmount}:</span>
              <span className="font-bold text-amber-600">{priceBreakdown.total} ₼</span>
            </div>
            <div className="flex justify-between text-red-600 dark:text-red-400">
              <span className="font-semibold">{t.deposit}:</span>
              <span className="font-semibold">{priceBreakdown.deposit} ₼</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}