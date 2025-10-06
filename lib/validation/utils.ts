import { FormikErrors, FormikTouched } from 'formik';
import * as Yup from 'yup';
import { BookingFormData } from '@/lib/types';

// Form validation error interface
export interface FormValidationError {
  field: string;
  message: string;
  type: 'required' | 'format' | 'min' | 'max' | 'custom';
}

// Form field validation helper
export const validateField = async (
  fieldName: string,
  value: any,
  schema: Yup.ObjectSchema<any>
): Promise<string | undefined> => {
  try {
    await schema.validateAt(fieldName, { [fieldName]: value });
    return undefined;
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      return error.message;
    }
    return 'Validation error';
  }
};

// Get field error message helper
export const getFieldError = (
  fieldName: string,
  errors: FormikErrors<any>,
  touched: FormikTouched<any>
): string | undefined => {
  const fieldError = getNestedValue(errors, fieldName);
  const fieldTouched = getNestedValue(touched, fieldName);
  
  return fieldTouched && fieldError ? fieldError : undefined;
};

// Helper to get nested object values (for nested form fields)
const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

// Check if field has error
export const hasFieldError = (
  fieldName: string,
  errors: FormikErrors<any>,
  touched: FormikTouched<any>
): boolean => {
  return !!getFieldError(fieldName, errors, touched);
};

// Format error message for display
export const formatErrorMessage = (error: string, lang: string = 'az'): string => {
  // Handle common error patterns and make them more user-friendly
  const errorPatterns = {
    az: {
      'must be a valid email': 'Düzgün email formatı daxil edin',
      'is a required field': 'Bu sahə tələb olunur',
      'must be at least': 'Minimum',
      'must be at most': 'Maksimum',
      'must match the following': 'Format düzgün deyil',
    },
    en: {
      'must be a valid email': 'Please enter a valid email format',
      'is a required field': 'This field is required',
      'must be at least': 'Must be at least',
      'must be at most': 'Must be at most',
      'must match the following': 'Invalid format',
    },
    ru: {
      'must be a valid email': 'Введите правильный формат email',
      'is a required field': 'Это поле обязательно',
      'must be at least': 'Должно быть минимум',
      'must be at most': 'Должно быть максимум',
      'must match the following': 'Неверный формат',
    },
    ar: {
      'must be a valid email': 'يرجى إدخال تنسيق بريد إلكتروني صحيح',
      'is a required field': 'هذا الحقل مطلوب',
      'must be at least': 'يجب أن يكون على الأقل',
      'must be at most': 'يجب أن يكون على الأكثر',
      'must match the following': 'تنسيق غير صحيح',
    },
  };

  const patterns = errorPatterns[lang as keyof typeof errorPatterns] || errorPatterns.az;
  
  let formattedError = error;
  Object.entries(patterns).forEach(([pattern, replacement]) => {
    if (formattedError.includes(pattern)) {
      formattedError = formattedError.replace(pattern, replacement);
    }
  });
  
  return formattedError;
};

// Enhanced phone number formatting and validation utilities
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  
  // Remove all non-digit characters except +
  let cleaned = phone.replace(/[^\d+]/g, '');
  
  // Handle different input formats for Azerbaijan numbers
  if (cleaned.startsWith('0')) {
    cleaned = '+994' + cleaned.substring(1);
  } else if (cleaned.startsWith('994') && !cleaned.startsWith('+994')) {
    cleaned = '+' + cleaned;
  } else if (!cleaned.startsWith('+') && cleaned.length === 9) {
    cleaned = '+994' + cleaned;
  }
  
  // Format for display: +994 XX XXX XX XX
  if (cleaned.startsWith('+994') && cleaned.length === 13) {
    return cleaned.replace(/(\+994)(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
  }
  
  // Handle international numbers (basic formatting)
  if (cleaned.startsWith('+') && cleaned.length > 7) {
    const countryCode = cleaned.substring(0, 4);
    const number = cleaned.substring(4);
    if (number.length >= 7) {
      return `${countryCode} ${number.substring(0, 3)} ${number.substring(3)}`;
    }
  }
  
  return cleaned;
};

// Advanced phone number formatting with mask
export const formatPhoneNumberWithMask = (phone: string, showMask: boolean = false): string => {
  const formatted = formatPhoneNumber(phone);
  
  if (!showMask || !formatted.startsWith('+994')) {
    return formatted;
  }
  
  // Apply mask for privacy: +994 XX XXX ** **
  return formatted.replace(/(\+994 \d{2} \d{3}) \d{2} \d{2}/, '$1 ** **');
};

// Validate phone number format
export const validatePhoneNumber = (phone: string): boolean => {
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

// Get phone number type/carrier info
export const getPhoneNumberInfo = (phone: string): { carrier?: string; type?: string } => {
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  if (cleaned.includes('994') || cleaned.startsWith('0')) {
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
    
    return carrierMap[operatorCode || ''] || {};
  }
  
  return {};
};

// Enhanced date validation utilities
export const isValidDate = (dateString: string): boolean => {
  if (!dateString) return false;
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime()) && dateString !== 'Invalid Date';
};

export const isDateInFuture = (dateString: string): boolean => {
  if (!isValidDate(dateString)) return false;
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
};

export const isDateInPast = (dateString: string): boolean => {
  if (!isValidDate(dateString)) return false;
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return date < today;
};

export const calculateDaysBetween = (startDate: string, endDate: string): number => {
  if (!isValidDate(startDate) || !isValidDate(endDate)) return 0;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end.getTime() - start.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Check if date is weekend
export const isWeekend = (dateString: string): boolean => {
  if (!isValidDate(dateString)) return false;
  const date = new Date(dateString);
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday or Saturday
};

// Check if date is a holiday (Azerbaijan holidays)
export const isHoliday = (dateString: string): boolean => {
  if (!isValidDate(dateString)) return false;
  const date = new Date(dateString);
  
  // Azerbaijan public holidays (month-day format)
  const holidays = [
    '01-01', // New Year's Day
    '01-02', // New Year's Day
    '03-08', // International Women's Day
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

// Get date validation message
export const getDateValidationMessage = (
  dateString: string,
  type: 'pickup' | 'dropoff',
  lang: string = 'az'
): string | undefined => {
  const messages = {
    az: {
      invalidDate: 'Düzgün tarix formatı daxil edin',
      pastDate: 'Tarix keçmişdə ola bilməz',
      tooFarFuture: 'Tarix çox uzaq gələcəkdə ola bilməz (maksimum 1 il)',
      weekendSurcharge: 'Həftə sonu əlavə haqqı tətbiq edilir',
      holidaySurcharge: 'Bayram günləri əlavə haqqı tətbiq edilir',
    },
    en: {
      invalidDate: 'Please enter a valid date format',
      pastDate: 'Date cannot be in the past',
      tooFarFuture: 'Date cannot be more than 1 year in the future',
      weekendSurcharge: 'Weekend surcharge applies',
      holidaySurcharge: 'Holiday surcharge applies',
    },
    ru: {
      invalidDate: 'Введите правильный формат даты',
      pastDate: 'Дата не может быть в прошлом',
      tooFarFuture: 'Дата не может быть более чем на год в будущем',
      weekendSurcharge: 'Применяется доплата за выходные',
      holidaySurcharge: 'Применяется доплата за праздники',
    },
    ar: {
      invalidDate: 'يرجى إدخال تنسيق تاريخ صحيح',
      pastDate: 'لا يمكن أن يكون التاريخ في الماضي',
      tooFarFuture: 'لا يمكن أن يكون التاريخ أكثر من سنة في المستقبل',
      weekendSurcharge: 'تطبق رسوم إضافية لعطلة نهاية الأسبوع',
      holidaySurcharge: 'تطبق رسوم إضافية للعطل',
    },
  };
  
  const langMessages = messages[lang as keyof typeof messages] || messages.az;
  
  if (!isValidDate(dateString)) {
    return langMessages.invalidDate;
  }
  
  if (isDateInPast(dateString)) {
    return langMessages.pastDate;
  }
  
  const date = new Date(dateString);
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
  
  if (date > oneYearFromNow) {
    return langMessages.tooFarFuture;
  }
  
  return undefined;
};

// Format date for display
export const formatDateForDisplay = (dateString: string, lang: string = 'az'): string => {
  if (!isValidDate(dateString)) return '';
  
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  };
  
  const localeMap = {
    az: 'az-AZ',
    en: 'en-US',
    ru: 'ru-RU',
    ar: 'ar-SA',
  };
  
  const locale = localeMap[lang as keyof typeof localeMap] || 'az-AZ';
  
  try {
    return date.toLocaleDateString(locale, options);
  } catch {
    return date.toLocaleDateString('en-US', options);
  }
};

// Form state persistence utilities
export const saveFormState = (formId: string, formData: any): void => {
  try {
    const serializedData = JSON.stringify({
      data: formData,
      timestamp: Date.now(),
    });
    localStorage.setItem(`form_state_${formId}`, serializedData);
  } catch (error) {
    console.warn('Failed to save form state:', error);
  }
};

export const loadFormState = <T>(formId: string, maxAge: number = 24 * 60 * 60 * 1000): T | null => {
  try {
    const serializedData = localStorage.getItem(`form_state_${formId}`);
    if (!serializedData) return null;
    
    const { data, timestamp } = JSON.parse(serializedData);
    
    // Check if data is not too old (default: 24 hours)
    if (Date.now() - timestamp > maxAge) {
      localStorage.removeItem(`form_state_${formId}`);
      return null;
    }
    
    return data as T;
  } catch (error) {
    console.warn('Failed to load form state:', error);
    return null;
  }
};

export const clearFormState = (formId: string): void => {
  try {
    localStorage.removeItem(`form_state_${formId}`);
  } catch (error) {
    console.warn('Failed to clear form state:', error);
  }
};

// Form submission utilities
export const prepareFormDataForSubmission = (formData: BookingFormData): BookingFormData => {
  return {
    ...formData,
    firstName: formData.firstName.trim(),
    lastName: formData.lastName.trim(),
    email: formData.email.trim().toLowerCase(),
    phone: formatPhoneNumber(formData.phone),
    specialRequests: formData.specialRequests?.trim() || '',
  };
};

// Validation summary utilities
export const getFormValidationSummary = (
  errors: FormikErrors<any>,
  touched: FormikTouched<any>
): FormValidationError[] => {
  const validationErrors: FormValidationError[] = [];
  
  const processErrors = (errorObj: any, touchedObj: any, prefix = '') => {
    Object.keys(errorObj).forEach(key => {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      const error = errorObj[key];
      const isTouched = touchedObj?.[key];
      
      if (typeof error === 'string' && isTouched) {
        validationErrors.push({
          field: fullKey,
          message: error,
          type: getErrorType(error),
        });
      } else if (typeof error === 'object' && error !== null) {
        processErrors(error, touchedObj?.[key], fullKey);
      }
    });
  };
  
  processErrors(errors, touched);
  return validationErrors;
};

// Determine error type from error message
const getErrorType = (errorMessage: string): FormValidationError['type'] => {
  if (errorMessage.includes('required')) return 'required';
  if (errorMessage.includes('email') || errorMessage.includes('format')) return 'format';
  if (errorMessage.includes('at least') || errorMessage.includes('minimum')) return 'min';
  if (errorMessage.includes('at most') || errorMessage.includes('maximum')) return 'max';
  return 'custom';
};

// Debounced validation utility
export const createDebouncedValidator = (
  validateFn: (value: any) => Promise<string | undefined>,
  delay: number = 300
) => {
  let timeoutId: NodeJS.Timeout;
  
  return (value: any): Promise<string | undefined> => {
    return new Promise((resolve) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        const result = await validateFn(value);
        resolve(result);
      }, delay);
    });
  };
};

// Form field focus utilities
export const focusFirstErrorField = (errors: FormikErrors<any>): void => {
  const firstErrorField = Object.keys(errors)[0];
  if (firstErrorField) {
    const element = document.querySelector(`[name="${firstErrorField}"]`) as HTMLElement;
    if (element) {
      element.focus();
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
};

// Enhanced custom validation rules
export const customValidationRules = {
  // Check if pickup and dropoff locations are different
  differentLocations: (pickupLocation: string, dropoffLocation: string, lang: string = 'az') => {
    const messages = {
      az: 'Götürülmə və qaytarılma yerləri fərqli olmalıdır',
      en: 'Pickup and drop-off locations must be different',
      ru: 'Места получения и возврата должны быть разными',
      ar: 'يجب أن تكون أماكن الاستلام والإرجاع مختلفة',
    };
    
    if (pickupLocation && dropoffLocation && pickupLocation.trim() === dropoffLocation.trim()) {
      return messages[lang as keyof typeof messages] || messages.az;
    }
    return undefined;
  },
  
  // Check if rental period is within business rules
  validRentalPeriod: (days: number, lang: string = 'az') => {
    const messages = {
      az: 'Kirayə müddəti 2-365 gün arasında olmalıdır',
      en: 'Rental period must be between 2-365 days',
      ru: 'Период аренды должен быть от 2 до 365 дней',
      ar: 'يجب أن تكون فترة الإيجار بين 2-365 يومًا',
    };
    
    if (days < 2 || days > 365) {
      return messages[lang as keyof typeof messages] || messages.az;
    }
    return undefined;
  },
  
  // Validate age requirement (minimum 21 for most cars)
  validateAge: (birthDate: string, lang: string = 'az') => {
    const messages = {
      az: 'Minimum yaş tələbi: 21 yaş',
      en: 'Minimum age requirement: 21 years old',
      ru: 'Минимальное возрастное требование: 21 год',
      ar: 'الحد الأدنى لمتطلبات العمر: 21 سنة',
    };
    
    if (!isValidDate(birthDate)) return undefined;
    
    const birth = new Date(birthDate);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate()) 
      ? age - 1 
      : age;
    
    if (actualAge < 21) {
      return messages[lang as keyof typeof messages] || messages.az;
    }
    return undefined;
  },
  
  // Validate business hours for pickup/dropoff
  validateBusinessHours: (dateString: string, lang: string = 'az') => {
    const messages = {
      az: 'İş saatları: Bazar ertəsi - Cümə 09:00-18:00, Şənbə 09:00-16:00',
      en: 'Business hours: Monday-Friday 09:00-18:00, Saturday 09:00-16:00',
      ru: 'Рабочие часы: Понедельник-Пятница 09:00-18:00, Суббота 09:00-16:00',
      ar: 'ساعات العمل: الاثنين-الجمعة 09:00-18:00، السبت 09:00-16:00',
    };
    
    if (!isValidDate(dateString)) return undefined;
    
    const date = new Date(dateString);
    const day = date.getDay();
    
    // Sunday is closed
    if (day === 0) {
      return messages[lang as keyof typeof messages] || messages.az;
    }
    
    return undefined;
  },
  
  // Validate email domain (basic business rule)
  validateEmailDomain: (email: string, lang: string = 'az') => {
    const messages = {
      az: 'Email domenini yoxlayın',
      en: 'Please check email domain',
      ru: 'Проверьте домен email',
      ar: 'يرجى التحقق من نطاق البريد الإلكتروني',
    };
    
    if (!email) return undefined;
    
    const domain = email.split('@')[1];
    if (!domain) return messages[lang as keyof typeof messages] || messages.az;
    
    // Check for common typos in popular domains
    const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    const typoPatterns = [
      { pattern: /gmai\.com|gmial\.com|gmail\.co/, correct: 'gmail.com' },
      { pattern: /yahoo\.co|yaho\.com/, correct: 'yahoo.com' },
      { pattern: /hotmai\.com|hotmial\.com/, correct: 'hotmail.com' },
      { pattern: /outlook\.co|outlok\.com/, correct: 'outlook.com' },
    ];
    
    for (const typo of typoPatterns) {
      if (typo.pattern.test(domain)) {
        return `Did you mean ${typo.correct}?`;
      }
    }
    
    return undefined;
  },
  
  // Validate special characters in names
  validateNameCharacters: (name: string, lang: string = 'az') => {
    const messages = {
      az: 'Adda yalnız hərflər, boşluq və defis istifadə edin',
      en: 'Name should only contain letters, spaces, and hyphens',
      ru: 'Имя должно содержать только буквы, пробелы и дефисы',
      ar: 'يجب أن يحتوي الاسم على أحرف ومسافات وشرطات فقط',
    };
    
    if (!name) return undefined;
    
    // Allow letters, spaces, hyphens, apostrophes, and international characters
    const validNamePattern = /^[\p{L}\p{M}\s'-]+$/u;
    
    if (!validNamePattern.test(name)) {
      return messages[lang as keyof typeof messages] || messages.az;
    }
    
    // Check for suspicious patterns
    if (/(.)\1{3,}/.test(name)) { // More than 3 consecutive same characters
      return messages[lang as keyof typeof messages] || messages.az;
    }
    
    return undefined;
  },
};