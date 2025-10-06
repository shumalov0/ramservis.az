'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Phone } from 'lucide-react';
import { BookingFormData } from '@/lib/types';
import { useTranslation } from '@/lib/translations';

interface PersonalInfoFormProps {
  formData: Partial<BookingFormData>;
  onUpdate: (updates: Partial<BookingFormData>) => void;
  currentLang: string;
  errors: Record<string, string>;
}

export default function PersonalInfoForm({
  formData,
  onUpdate,
  currentLang,
  errors
}: PersonalInfoFormProps) {
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

  return (
    <div className="space-y-6" onKeyDown={handleKeyDown}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {t.personalInfo || 'Şəxsi Məlumatlar'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="flex items-center gap-2 text-sm sm:text-base">
                <User className="h-4 w-4 flex-shrink-0" />
                {t.firstName || 'Ad'} *
              </Label>
              <Input
                id="firstName"
                value={formData.firstName || ''}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === ' ' && e.currentTarget.selectionStart === 0) {
                    e.preventDefault();
                  }
                }}
                placeholder="Adınızı daxil edin"
                className={`${errors.firstName ? 'border-red-500' : ''} text-base`}
              />
              {errors.firstName && (
                <p className="text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="flex items-center gap-2 text-sm sm:text-base">
                <User className="h-4 w-4 flex-shrink-0" />
                {t.lastName || 'Soyad'} *
              </Label>
              <Input
                id="lastName"
                value={formData.lastName || ''}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === ' ' && e.currentTarget.selectionStart === 0) {
                    e.preventDefault();
                  }
                }}
                placeholder="Soyadınızı daxil edin"
                className={`${errors.lastName ? 'border-red-500' : ''} text-base`}
              />
              {errors.lastName && (
                <p className="text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2 text-sm sm:text-base">
              <Mail className="h-4 w-4 flex-shrink-0" />
              {t.email || 'E-mail'} *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onKeyDown={(e) => {
                if (e.key === ' ') {
                  e.preventDefault();
                }
              }}
              placeholder="E-mail ünvanınızı daxil edin"
              className={`${errors.email ? 'border-red-500' : ''} text-base`}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2 text-sm sm:text-base">
              <Phone className="h-4 w-4 flex-shrink-0" />
              {t.phone || 'Telefon'} *
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              onKeyDown={(e) => {
                if (e.key === ' ' && e.currentTarget.selectionStart === 0) {
                  e.preventDefault();
                }
              }}
              placeholder="+994 XX XXX XX XX"
              className={`${errors.phone ? 'border-red-500' : ''} text-base`}
            />
            {errors.phone && (
              <p className="text-sm text-red-600">{errors.phone}</p>
            )}
            <p className="text-xs sm:text-sm text-gray-500">
              Telefon nömrəsini +994 formatında daxil edin
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}