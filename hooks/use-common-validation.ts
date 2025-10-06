'use client';

import { useState, useCallback, useMemo } from 'react';
import { isValidEmail, isValidPhone } from '@/lib/common-utils';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

export interface ValidationErrors {
  [key: string]: string;
}

export function useCommonValidation(rules: ValidationRules) {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = useCallback((name: string, value: any): string | null => {
    const rule = rules[name];
    if (!rule) return null;

    // Required validation
    if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return 'Bu sahə tələb olunur';
    }

    // Skip other validations if field is empty and not required
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return null;
    }

    // String validations
    if (typeof value === 'string') {
      // Min length validation
      if (rule.minLength && value.length < rule.minLength) {
        return `Minimum ${rule.minLength} simvol tələb olunur`;
      }

      // Max length validation
      if (rule.maxLength && value.length > rule.maxLength) {
        return `Maksimum ${rule.maxLength} simvol icazə verilir`;
      }

      // Pattern validation
      if (rule.pattern && !rule.pattern.test(value)) {
        return 'Format düzgün deyil';
      }
    }

    // Custom validation
    if (rule.custom) {
      const customError = rule.custom(value);
      if (customError) return customError;
    }

    return null;
  }, [rules]);

  const validateForm = useCallback((formData: Record<string, any>): ValidationErrors => {
    const newErrors: ValidationErrors = {};

    Object.keys(rules).forEach(fieldName => {
      const error = validateField(fieldName, formData[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
      }
    });

    setErrors(newErrors);
    return newErrors;
  }, [rules, validateField]);

  const validateSingleField = useCallback((name: string, value: any) => {
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error || ''
    }));
    return error;
  }, [validateField]);

  const setFieldTouched = useCallback((name: string, isTouched: boolean = true) => {
    setTouched(prev => ({
      ...prev,
      [name]: isTouched
    }));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
    setTouched({});
  }, []);

  const clearFieldError = useCallback((name: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }, []);

  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  const hasErrors = useMemo(() => {
    return Object.values(errors).some(error => error && error.length > 0);
  }, [errors]);

  return {
    errors,
    touched,
    isValid,
    hasErrors,
    validateForm,
    validateSingleField,
    setFieldTouched,
    clearErrors,
    clearFieldError
  };
}

// Common validation rules
export const commonValidationRules = {
  email: {
    required: true,
    custom: (value: string) => {
      if (!isValidEmail(value)) {
        return 'Düzgün email ünvanı daxil edin';
      }
      return null;
    }
  },
  phone: {
    required: true,
    custom: (value: string) => {
      if (!isValidPhone(value)) {
        return 'Düzgün telefon nömrəsi daxil edin';
      }
      return null;
    }
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-ZəüöğıçşƏÜÖĞIÇŞ\s]+$/
  },
  password: {
    required: true,
    minLength: 8,
    custom: (value: string) => {
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
        return 'Parol ən azı bir kiçik hərf, bir böyük hərf və bir rəqəm olmalıdır';
      }
      return null;
    }
  },
  date: {
    required: true,
    custom: (value: string) => {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return 'Düzgün tarix daxil edin';
      }
      return null;
    }
  },
  futureDate: {
    required: true,
    custom: (value: string) => {
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (isNaN(date.getTime())) {
        return 'Düzgün tarix daxil edin';
      }
      
      if (date < today) {
        return 'Tarix bugündən sonra olmalıdır';
      }
      
      return null;
    }
  }
};