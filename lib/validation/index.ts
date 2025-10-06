// Export all validation schemas
export {
  createBookingValidationSchema,
  createContactValidationSchema,
  createNewsletterValidationSchema,
  createCarFilterValidationSchema,
  createQuickBookingValidationSchema,
  createReviewValidationSchema,
  createWhatsAppMessageValidationSchema,
  bookingValidationSchema,
  contactValidationSchema,
  newsletterValidationSchema,
  carFilterValidationSchema,
  quickBookingValidationSchema,
  reviewValidationSchema,
  whatsappMessageValidationSchema,
  validationMessages,
  getValidationMessages,
} from './schemas';

// Export all validation utilities
export {
  validateField,
  getFieldError,
  hasFieldError,
  formatErrorMessage,
  formatPhoneNumber,
  validatePhoneNumber,
  getPhoneNumberInfo,
  isValidDate,
  isDateInFuture,
  isDateInPast,
  calculateDaysBetween,
  isWeekend,
  isHoliday,
  getDateValidationMessage,
  formatDateForDisplay,
  saveFormState,
  loadFormState,
  clearFormState,
  prepareFormDataForSubmission,
  getFormValidationSummary,
  createDebouncedValidator,
  focusFirstErrorField,
  customValidationRules,
} from './utils';

// Export types
export type { FormValidationError } from './utils';

// Validation constants
export const VALIDATION_CONSTANTS = {
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
  MIN_EMAIL_LENGTH: 5,
  MAX_EMAIL_LENGTH: 100,
  MIN_PHONE_LENGTH: 9,
  MAX_PHONE_LENGTH: 15,
  MIN_RENTAL_DAYS: 2,
  MAX_RENTAL_DAYS: 365,
  MIN_REVIEW_LENGTH: 10,
  MAX_REVIEW_LENGTH: 1000,
  MIN_MESSAGE_LENGTH: 5,
  MAX_MESSAGE_LENGTH: 500,
  MIN_AGE: 21,
  MAX_PRICE: 100000,
  MAX_DEPOSIT: 10000,
  MAX_SERVICE_CHARGES: 5000,
} as const;

// Validation error types
export type ValidationErrorType = 'required' | 'format' | 'min' | 'max' | 'custom';

// Language support
export type SupportedLanguage = 'az' | 'en' | 'ru' | 'ar';

// Phone number carriers
export const PHONE_CARRIERS = {
  '50': 'Azercell',
  '51': 'Azercell', 
  '55': 'Bakcell',
  '70': 'Nar Mobile',
  '77': 'Nar Mobile',
  '99': 'Bakcell',
  '10': 'Nakhtel',
  '12': 'Azerfon',
} as const;