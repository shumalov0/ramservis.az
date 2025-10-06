import * as Yup from 'yup';
import { BookingFormData } from '@/lib/types';

// Internal validation utilities (to avoid circular imports)
const validatePhoneNumberInternal = (phone: string): boolean => {
  if (!phone) return false;
  
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Azerbaijan phone number patterns
  const azerbaijanPatterns = [
    /^\+994(50|51|55|70|77|99|10|12)\d{7}$/, // +994 format
    /^994(50|51|55|70|77|99|10|12)\d{7}$/, // 994 format
    /^0(50|51|55|70|77|99|10|12)\d{7}$/, // 0 format
    /^(50|51|55|70|77|99|10|12)\d{7}$/, // Direct format
  ];
  
  // Check Azerbaijan patterns first
  for (const pattern of azerbaijanPatterns) {
    if (pattern.test(cleaned)) return true;
  }
  
  // International format fallback (basic validation)
  const internationalPattern = /^\+\d{7,15}$/;
  return internationalPattern.test(cleaned);
};

// Comprehensive multilingual error messages
export const validationMessages = {
  az: {
    required: 'Bu sahə tələb olunur',
    email: 'Düzgün email formatı daxil edin',
    phone: 'Düzgün telefon nömrəsi daxil edin',
    minLength: (min: number) => `Minimum ${min} simvol olmalıdır`,
    maxLength: (max: number) => `Maksimum ${max} simvol olmalıdır`,
    dateMin: 'Tarix bugündən əvvəl ola bilməz',
    dateAfter: 'Qaytarılma tarixi götürülmə tarixindən sonra olmalıdır',
    minRentalPeriod: 'Minimum kirayə müddəti 2 gündür',
    maxRentalPeriod: 'Maksimum kirayə müddəti 365 gündür',
    invalidDate: 'Düzgün tarix formatı daxil edin',
    phoneFormat: 'Telefon nömrəsi +994 formatında olmalıdır',
    nameFormat: 'Yalnız hərflər və boşluq istifadə edin',
    sameLocation: 'Götürülmə və qaytarılma yerləri fərqli olmalıdır',
    futureDate: 'Tarix gələcəkdə olmalıdır',
    weekendSurcharge: 'Həftə sonu əlavə haqqı tətbiq edilir',
    holidaySurcharge: 'Bayram günləri əlavə haqqı tətbiq edilir',
    ageRestriction: 'Yaş məhdudiyyəti: minimum 21 yaş',
    licenseRequired: 'Sürücülük vəsiqəsi tələb olunur',
    invalidPaymentMethod: 'Düzgün ödəniş üsulu seçin',
  },
  en: {
    required: 'This field is required',
    email: 'Please enter a valid email format',
    phone: 'Please enter a valid phone number',
    minLength: (min: number) => `Must be at least ${min} characters`,
    maxLength: (max: number) => `Must be at most ${max} characters`,
    dateMin: 'Date cannot be in the past',
    dateAfter: 'Return date must be after pickup date',
    minRentalPeriod: 'Minimum rental period is 2 days',
    maxRentalPeriod: 'Maximum rental period is 365 days',
    invalidDate: 'Please enter a valid date format',
    phoneFormat: 'Phone number should be in +994 format',
    nameFormat: 'Only letters and spaces are allowed',
    sameLocation: 'Pickup and drop-off locations must be different',
    futureDate: 'Date must be in the future',
    weekendSurcharge: 'Weekend surcharge applies',
    holidaySurcharge: 'Holiday surcharge applies',
    ageRestriction: 'Age restriction: minimum 21 years old',
    licenseRequired: 'Valid driving license required',
    invalidPaymentMethod: 'Please select a valid payment method',
  },
  ru: {
    required: 'Это поле обязательно',
    email: 'Введите правильный формат email',
    phone: 'Введите правильный номер телефона',
    minLength: (min: number) => `Должно быть минимум ${min} символов`,
    maxLength: (max: number) => `Должно быть максимум ${max} символов`,
    dateMin: 'Дата не может быть в прошлом',
    dateAfter: 'Дата возврата должна быть после даты получения',
    minRentalPeriod: 'Минимальный период аренды 2 дня',
    maxRentalPeriod: 'Максимальный период аренды 365 дней',
    invalidDate: 'Введите правильный формат даты',
    phoneFormat: 'Номер телефона должен быть в формате +994',
    nameFormat: 'Разрешены только буквы и пробелы',
    sameLocation: 'Места получения и возврата должны быть разными',
    futureDate: 'Дата должна быть в будущем',
    weekendSurcharge: 'Применяется доплата за выходные',
    holidaySurcharge: 'Применяется доплата за праздники',
    ageRestriction: 'Возрастное ограничение: минимум 21 год',
    licenseRequired: 'Требуются действующие водительские права',
    invalidPaymentMethod: 'Выберите правильный способ оплаты',
  },
  ar: {
    required: 'هذا الحقل مطلوب',
    email: 'يرجى إدخال تنسيق بريد إلكتروني صحيح',
    phone: 'يرجى إدخال رقم هاتف صحيح',
    minLength: (min: number) => `يجب أن يكون على الأقل ${min} أحرف`,
    maxLength: (max: number) => `يجب أن يكون على الأكثر ${max} أحرف`,
    dateMin: 'لا يمكن أن يكون التاريخ في الماضي',
    dateAfter: 'يجب أن يكون تاريخ الإرجاع بعد تاريخ الاستلام',
    minRentalPeriod: 'الحد الأدنى لفترة الإيجار يومان',
    maxRentalPeriod: 'الحد الأقصى لفترة الإيجار 365 يومًا',
    invalidDate: 'يرجى إدخال تنسيق تاريخ صحيح',
    phoneFormat: 'يجب أن يكون رقم الهاتف بتنسيق +994',
    nameFormat: 'مسموح بالحروف والمسافات فقط',
    sameLocation: 'يجب أن تكون أماكن الاستلام والإرجاع مختلفة',
    futureDate: 'يجب أن يكون التاريخ في المستقبل',
    weekendSurcharge: 'تطبق رسوم إضافية لعطلة نهاية الأسبوع',
    holidaySurcharge: 'تطبق رسوم إضافية للعطل',
    ageRestriction: 'قيود العمر: الحد الأدنى 21 سنة',
    licenseRequired: 'مطلوب رخصة قيادة سارية',
    invalidPaymentMethod: 'يرجى اختيار طريقة دفع صحيحة',
  },
};

// Get validation messages for a specific language
export const getValidationMessages = (lang: string = 'az') => {
  return validationMessages[lang as keyof typeof validationMessages] || validationMessages.az;
};

// Enhanced validation regex patterns
const PHONE_REGEX = /^(\+994|994|0)?(50|51|55|70|77|99|10|12)\d{7}$/;
const INTERNATIONAL_PHONE_REGEX = /^(\+\d{1,3})?[\s.-]?\(?\d{1,4}\)?[\s.-]?\d{1,4}[\s.-]?\d{1,9}$/;

// Name validation regex (letters, spaces, hyphens, apostrophes, and international characters)
// More permissive regex to handle all international characters including Azerbaijani
const NAME_REGEX = /^[\p{L}\p{M}\s'-]+$/u;

// Enhanced email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// Date validation utilities
const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday or Saturday
};

const isHoliday = (date: Date): boolean => {
  // Add Azerbaijan public holidays (simplified example)
  const holidays = [
    '01-01', // New Year
    '01-02', // New Year
    '03-08', // Women's Day
    '03-20', // Novruz Bayram
    '03-21', // Novruz Bayram
    '03-22', // Novruz Bayram
    '03-23', // Novruz Bayram
    '03-24', // Novruz Bayram
    '05-09', // Victory Day
    '05-28', // Republic Day
    '06-15', // National Salvation Day
    '06-26', // Armed Forces Day
    '10-18', // Independence Day
    '11-09', // Flag Day
    '11-17', // National Revival Day
    '12-31', // Solidarity Day
  ];
  
  const monthDay = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  return holidays.includes(monthDay);
};

// Advanced phone number validation and formatting with carrier detection
const validatePhoneNumberAdvanced = (phone: string): { isValid: boolean; carrier?: string; type?: string } => {
  if (!phone) return { isValid: false };
  
  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Check Azerbaijan format first
  if (PHONE_REGEX.test(cleaned)) {
    const operatorCode = cleaned.match(/(50|51|55|70|77|99|10|12)/)?.[0];
    const carrierMap: Record<string, { carrier: string; type: string }> = {
      '50': { carrier: 'Azercell', type: 'mobile' },
      '51': { carrier: 'Azercell', type: 'mobile' },
      '55': { carrier: 'Bakcell', type: 'mobile' },
      '70': { carrier: 'Nar Mobile', type: 'mobile' },
      '77': { carrier: 'Nar Mobile', type: 'mobile' },
      '99': { carrier: 'Bakcell', type: 'mobile' },
      '10': { carrier: 'Nakhtel', type: 'mobile' },
      '12': { carrier: 'Azerfon', type: 'landline' },
    };
    
    const info = carrierMap[operatorCode || ''];
    return { isValid: true, ...info };
  }
  
  // Check international format as fallback
  if (INTERNATIONAL_PHONE_REGEX.test(phone)) {
    return { isValid: true, type: 'international' };
  }
  
  return { isValid: false };
};

// Enhanced date validation with weekend and holiday checks
const validateRentalDate = (date: Date, lang: string = 'az'): string | undefined => {
  const messages = getValidationMessages(lang);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (date < today) {
    return messages.dateMin;
  }
  
  // Check if date is too far in the future (1 year)
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
  
  if (date > oneYearFromNow) {
    return 'Date cannot be more than 1 year in the future';
  }
  
  // Check for weekend surcharge notification
  if (isWeekend(date)) {
    // This is informational, not an error
    console.info(messages.weekendSurcharge);
  }
  
  // Check for holiday surcharge notification
  if (isHoliday(date)) {
    // This is informational, not an error
    console.info(messages.holidaySurcharge);
  }
  
  return undefined;
};

// Enhanced booking validation schema with comprehensive validation
export const createBookingValidationSchema = (lang: string = 'az') => {
  const messages = getValidationMessages(lang);
  
  return Yup.object<BookingFormData>({
    // Personal Information with enhanced validation
    firstName: Yup.string()
      .required(messages.required)
      .min(2, messages.minLength(2))
      .max(50, messages.maxLength(50))
      .matches(NAME_REGEX, messages.nameFormat)
      .trim()
      .test('no-numbers', messages.nameFormat, (value) => {
        return value ? !/\d/.test(value) : true;
      }),
    
    lastName: Yup.string()
      .required(messages.required)
      .min(2, messages.minLength(2))
      .max(50, messages.maxLength(50))
      .matches(NAME_REGEX, messages.nameFormat)
      .trim()
      .test('no-numbers', messages.nameFormat, (value) => {
        return value ? !/\d/.test(value) : true;
      }),
    
    email: Yup.string()
      .required(messages.required)
      .matches(EMAIL_REGEX, messages.email)
      .max(100, messages.maxLength(100))
      .trim()
      .lowercase()
      .test('valid-domain', messages.email, (value) => {
        if (!value) return true;
        const domain = value.split('@')[1];
        return !!(domain && domain.includes('.') && domain.length > 3);
      }),
    
    phone: Yup.string()
      .required(messages.required)
      .test('valid-phone', messages.phoneFormat, (value) => {
        return value ? validatePhoneNumberInternal(value) : false;
      })
      .transform((value) => {
        if (!value) return value;
        let cleaned = value.replace(/\s+/g, '').replace(/[()-]/g, '');
        
        // Handle Azerbaijan numbers
        if (cleaned.startsWith('0')) {
          cleaned = '+994' + cleaned.substring(1);
        } else if (cleaned.startsWith('994') && !cleaned.startsWith('+994')) {
          cleaned = '+' + cleaned;
        } else if (!cleaned.startsWith('+') && cleaned.length === 9) {
          cleaned = '+994' + cleaned;
        }
        
        return cleaned;
      }),
    
    // Rental Details with enhanced date validation
    carId: Yup.string()
      .required(messages.required)
      .min(1, messages.required),
    
    pickupDate: Yup.date()
      .required(messages.required)
      .min(new Date(), messages.dateMin)
      .test('valid-rental-date', messages.futureDate, function(value) {
        if (!value) return true;
        const error = validateRentalDate(value, lang);
        return error ? this.createError({ message: error }) : true;
      })
      .typeError(messages.invalidDate),
    
    dropoffDate: Yup.date()
      .required(messages.required)
      .min(Yup.ref('pickupDate'), messages.dateAfter)
      .test('min-rental-period', messages.minRentalPeriod, function(value) {
        const { pickupDate } = this.parent;
        if (!value || !pickupDate) return true;
        
        const pickup = new Date(pickupDate);
        const dropoff = new Date(value);
        const diffTime = dropoff.getTime() - pickup.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return diffDays >= 2;
      })
      .test('max-rental-period', messages.maxRentalPeriod, function(value) {
        const { pickupDate } = this.parent;
        if (!value || !pickupDate) return true;
        
        const pickup = new Date(pickupDate);
        const dropoff = new Date(value);
        const diffTime = dropoff.getTime() - pickup.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return diffDays <= 365;
      })
      .typeError(messages.invalidDate),
    
    pickupLocation: Yup.string()
      .required(messages.required)
      .min(3, messages.minLength(3))
      .max(100, messages.maxLength(100)),
    
    dropoffLocation: Yup.string()
      .required(messages.required)
      .min(3, messages.minLength(3))
      .max(100, messages.maxLength(100))
      .test('different-locations', messages.sameLocation, function(value) {
        const { pickupLocation } = this.parent;
        return !value || !pickupLocation || value !== pickupLocation;
      }),
    
    // Additional Services validation
    additionalServices: Yup.array()
      .of(Yup.string().min(1))
      .default([])
      .max(10, 'Maximum 10 additional services allowed'),
    
    // Payment Method with strict validation
    paymentMethod: Yup.string()
      .required(messages.required)
      .oneOf(['cash', 'online'], messages.invalidPaymentMethod),
    
    // Special Requests with enhanced validation
    specialRequests: Yup.string()
      .max(500, messages.maxLength(500))
      .optional()
      .test('no-harmful-content', 'Invalid content', (value) => {
        if (!value) return true;
        // Basic content filtering
        const harmfulPatterns = /<script|javascript:|data:|vbscript:/i;
        return !harmfulPatterns.test(value);
      }),
    
    // Calculated fields validation
    totalDays: Yup.number()
      .required()
      .min(1, 'Minimum rental period is 1 day')
      .max(365, messages.maxRentalPeriod)
      .integer('Must be a whole number'),
    
    totalPrice: Yup.number()
      .required()
      .min(0, 'Price cannot be negative')
      .max(100000, 'Price seems too high, please contact support'),
    
    deposit: Yup.number()
      .required()
      .min(0, 'Deposit cannot be negative')
      .max(10000, 'Deposit seems too high'),
    
    serviceCharges: Yup.number()
      .required()
      .min(0, 'Service charges cannot be negative')
      .max(5000, 'Service charges seem too high'),
  });
};

// Contact form validation schema
export const createContactValidationSchema = (lang: string = 'az') => {
  const messages = getValidationMessages(lang);
  
  return Yup.object({
    name: Yup.string()
      .required(messages.required)
      .min(2, messages.minLength(2))
      .max(100, messages.maxLength(100))
      .matches(NAME_REGEX, messages.nameFormat)
      .trim(),
    
    email: Yup.string()
      .required(messages.required)
      .matches(EMAIL_REGEX, messages.email)
      .max(100, messages.maxLength(100))
      .trim()
      .lowercase(),
    
    phone: Yup.string()
      .matches(PHONE_REGEX, messages.phoneFormat)
      .optional()
      .transform((value) => {
        if (!value) return value;
        let cleaned = value.replace(/\s+/g, '').replace(/[()-]/g, '');
        if (cleaned.startsWith('0')) {
          cleaned = '+994' + cleaned.substring(1);
        } else if (cleaned.startsWith('994') && !cleaned.startsWith('+994')) {
          cleaned = '+' + cleaned;
        } else if (!cleaned.startsWith('+994')) {
          cleaned = '+994' + cleaned;
        }
        return cleaned;
      }),
    
    subject: Yup.string()
      .required(messages.required)
      .min(5, messages.minLength(5))
      .max(200, messages.maxLength(200))
      .trim(),
    
    message: Yup.string()
      .required(messages.required)
      .min(10, messages.minLength(10))
      .max(1000, messages.maxLength(1000))
      .trim(),
  });
};

// Newsletter subscription validation schema
export const createNewsletterValidationSchema = (lang: string = 'az') => {
  const messages = getValidationMessages(lang);
  
  return Yup.object({
    email: Yup.string()
      .required(messages.required)
      .matches(EMAIL_REGEX, messages.email)
      .max(100, messages.maxLength(100))
      .trim()
      .lowercase(),
  });
};

// Car search/filter validation schema
export const createCarFilterValidationSchema = (lang: string = 'az') => {
  const messages = getValidationMessages(lang);
  
  return Yup.object({
    category: Yup.array().of(Yup.string()).optional(),
    priceRange: Yup.array()
      .of(Yup.number().min(0))
      .length(2)
      .optional(),
    year: Yup.array()
      .of(Yup.number().min(1990).max(new Date().getFullYear() + 1))
      .length(2)
      .optional(),
    fuelType: Yup.array().of(Yup.string()).optional(),
    transmission: Yup.array().of(Yup.string()).optional(),
    features: Yup.array().of(Yup.string()).optional(),
    seats: Yup.array().of(Yup.number().min(1).max(20)).optional(),
    class: Yup.array().of(Yup.string()).optional(),
    availability: Yup.boolean().optional(),
  });
};

// Quick booking validation schema (simplified version for quick forms)
export const createQuickBookingValidationSchema = (lang: string = 'az') => {
  const messages = getValidationMessages(lang);
  
  return Yup.object({
    name: Yup.string()
      .required(messages.required)
      .min(2, messages.minLength(2))
      .max(100, messages.maxLength(100))
      .matches(NAME_REGEX, messages.nameFormat),
    
    phone: Yup.string()
      .required(messages.required)
      .test('valid-phone', messages.phoneFormat, (value) => {
        return value ? validatePhoneNumberInternal(value) : false;
      }),
    
    carId: Yup.string()
      .required(messages.required),
    
    preferredDate: Yup.date()
      .required(messages.required)
      .min(new Date(), messages.dateMin)
      .typeError(messages.invalidDate),
  });
};

// Review submission validation schema
export const createReviewValidationSchema = (lang: string = 'az') => {
  const messages = getValidationMessages(lang);
  
  return Yup.object({
    customerName: Yup.string()
      .required(messages.required)
      .min(2, messages.minLength(2))
      .max(100, messages.maxLength(100))
      .matches(NAME_REGEX, messages.nameFormat),
    
    email: Yup.string()
      .required(messages.required)
      .matches(EMAIL_REGEX, messages.email),
    
    rating: Yup.number()
      .required(messages.required)
      .min(1, 'Rating must be at least 1 star')
      .max(5, 'Rating cannot exceed 5 stars')
      .integer('Rating must be a whole number'),
    
    reviewText: Yup.string()
      .required(messages.required)
      .min(10, messages.minLength(10))
      .max(1000, messages.maxLength(1000)),
    
    carRented: Yup.string()
      .optional()
      .max(100, messages.maxLength(100)),
  });
};

// WhatsApp message validation schema
export const createWhatsAppMessageValidationSchema = (lang: string = 'az') => {
  const messages = getValidationMessages(lang);
  
  return Yup.object({
    message: Yup.string()
      .required(messages.required)
      .min(5, messages.minLength(5))
      .max(500, messages.maxLength(500)),
    
    context: Yup.string()
      .oneOf(['booking', 'inquiry', 'support', 'general'])
      .default('general'),
    
    carId: Yup.string().optional(),
    
    urgency: Yup.string()
      .oneOf(['low', 'medium', 'high'])
      .default('medium'),
  });
};

// Export default schemas for convenience
export const bookingValidationSchema = createBookingValidationSchema();
export const contactValidationSchema = createContactValidationSchema();
export const newsletterValidationSchema = createNewsletterValidationSchema();
export const carFilterValidationSchema = createCarFilterValidationSchema();
export const quickBookingValidationSchema = createQuickBookingValidationSchema();
export const reviewValidationSchema = createReviewValidationSchema();
export const whatsappMessageValidationSchema = createWhatsAppMessageValidationSchema();