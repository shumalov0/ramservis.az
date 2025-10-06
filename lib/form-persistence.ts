import { BookingFormData } from '@/lib/types';

// Form state persistence utilities
export interface FormStateOptions {
  storageKey?: string;
  expirationHours?: number;
  autoSave?: boolean;
  autoSaveDelay?: number;
}

export interface PersistedFormState<T = any> {
  data: T;
  timestamp: number;
  version: string;
  formId: string;
}

// Default options
const DEFAULT_OPTIONS: Required<FormStateOptions> = {
  storageKey: 'ramservis_form_state',
  expirationHours: 24,
  autoSave: true,
  autoSaveDelay: 1000,
};

// Version for form state compatibility
const FORM_STATE_VERSION = '1.0.0';

/**
 * Save form state to localStorage with metadata
 */
export const saveFormState = <T = any>(
  formId: string,
  data: T,
  options: FormStateOptions = {}
): boolean => {
  try {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    const storageKey = `${opts.storageKey}_${formId}`;
    
    const persistedState: PersistedFormState<T> = {
      data,
      timestamp: Date.now(),
      version: FORM_STATE_VERSION,
      formId,
    };

    localStorage.setItem(storageKey, JSON.stringify(persistedState));
    
    // Also save to a general index for cleanup purposes
    const indexKey = `${opts.storageKey}_index`;
    const existingIndex = JSON.parse(localStorage.getItem(indexKey) || '[]');
    const updatedIndex = [...existingIndex.filter((id: string) => id !== formId), formId];
    localStorage.setItem(indexKey, JSON.stringify(updatedIndex));
    
    return true;
  } catch (error) {
    console.warn('Failed to save form state:', error);
    return false;
  }
};

/**
 * Load form state from localStorage with validation
 */
export const loadFormState = <T = any>(
  formId: string,
  options: FormStateOptions = {}
): T | null => {
  try {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    const storageKey = `${opts.storageKey}_${formId}`;
    
    const stored = localStorage.getItem(storageKey);
    if (!stored) return null;

    const persistedState: PersistedFormState<T> = JSON.parse(stored);
    
    // Check if data has expired
    const now = Date.now();
    const expirationTime = persistedState.timestamp + (opts.expirationHours * 60 * 60 * 1000);
    
    if (now > expirationTime) {
      // Data has expired, remove it
      clearFormState(formId, options);
      return null;
    }

    // Check version compatibility
    if (persistedState.version !== FORM_STATE_VERSION) {
      console.warn('Form state version mismatch, clearing old data');
      clearFormState(formId, options);
      return null;
    }

    return persistedState.data;
  } catch (error) {
    console.warn('Failed to load form state:', error);
    return null;
  }
};

/**
 * Clear specific form state
 */
export const clearFormState = (
  formId: string,
  options: FormStateOptions = {}
): boolean => {
  try {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    const storageKey = `${opts.storageKey}_${formId}`;
    
    localStorage.removeItem(storageKey);
    
    // Remove from index
    const indexKey = `${opts.storageKey}_index`;
    const existingIndex = JSON.parse(localStorage.getItem(indexKey) || '[]');
    const updatedIndex = existingIndex.filter((id: string) => id !== formId);
    localStorage.setItem(indexKey, JSON.stringify(updatedIndex));
    
    return true;
  } catch (error) {
    console.warn('Failed to clear form state:', error);
    return false;
  }
};

/**
 * Clear all expired form states
 */
export const clearExpiredFormStates = (options: FormStateOptions = {}): number => {
  try {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    const indexKey = `${opts.storageKey}_index`;
    const existingIndex = JSON.parse(localStorage.getItem(indexKey) || '[]');
    
    let clearedCount = 0;
    const now = Date.now();
    const validFormIds: string[] = [];

    existingIndex.forEach((formId: string) => {
      const storageKey = `${opts.storageKey}_${formId}`;
      const stored = localStorage.getItem(storageKey);
      
      if (stored) {
        try {
          const persistedState: PersistedFormState = JSON.parse(stored);
          const expirationTime = persistedState.timestamp + (opts.expirationHours * 60 * 60 * 1000);
          
          if (now > expirationTime) {
            localStorage.removeItem(storageKey);
            clearedCount++;
          } else {
            validFormIds.push(formId);
          }
        } catch {
          // Invalid data, remove it
          localStorage.removeItem(storageKey);
          clearedCount++;
        }
      }
    });

    // Update index with valid form IDs
    localStorage.setItem(indexKey, JSON.stringify(validFormIds));
    
    return clearedCount;
  } catch (error) {
    console.warn('Failed to clear expired form states:', error);
    return 0;
  }
};

/**
 * Get all saved form states
 */
export const getAllFormStates = (options: FormStateOptions = {}): Array<{
  formId: string;
  data: any;
  timestamp: number;
  age: number;
}> => {
  try {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    const indexKey = `${opts.storageKey}_index`;
    const existingIndex = JSON.parse(localStorage.getItem(indexKey) || '[]');
    
    const now = Date.now();
    const formStates: Array<{
      formId: string;
      data: any;
      timestamp: number;
      age: number;
    }> = [];

    existingIndex.forEach((formId: string) => {
      const storageKey = `${opts.storageKey}_${formId}`;
      const stored = localStorage.getItem(storageKey);
      
      if (stored) {
        try {
          const persistedState: PersistedFormState = JSON.parse(stored);
          formStates.push({
            formId,
            data: persistedState.data,
            timestamp: persistedState.timestamp,
            age: now - persistedState.timestamp,
          });
        } catch {
          // Invalid data, skip
        }
      }
    });

    return formStates.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.warn('Failed to get all form states:', error);
    return [];
  }
};

/**
 * Check if form state exists
 */
export const hasFormState = (
  formId: string,
  options: FormStateOptions = {}
): boolean => {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const storageKey = `${opts.storageKey}_${formId}`;
  return localStorage.getItem(storageKey) !== null;
};

/**
 * Get form state metadata without loading the full data
 */
export const getFormStateMetadata = (
  formId: string,
  options: FormStateOptions = {}
): {
  exists: boolean;
  timestamp?: number;
  age?: number;
  isExpired?: boolean;
} => {
  try {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    const storageKey = `${opts.storageKey}_${formId}`;
    const stored = localStorage.getItem(storageKey);
    
    if (!stored) {
      return { exists: false };
    }

    const persistedState: PersistedFormState = JSON.parse(stored);
    const now = Date.now();
    const age = now - persistedState.timestamp;
    const expirationTime = persistedState.timestamp + (opts.expirationHours * 60 * 60 * 1000);
    const isExpired = now > expirationTime;

    return {
      exists: true,
      timestamp: persistedState.timestamp,
      age,
      isExpired,
    };
  } catch (error) {
    console.warn('Failed to get form state metadata:', error);
    return { exists: false };
  }
};

/**
 * Merge saved form state with current form data
 */
export const mergeFormState = <T extends Record<string, any>>(
  currentData: T,
  savedData: T | null,
  mergeStrategy: 'prefer-saved' | 'prefer-current' | 'merge-non-empty' = 'merge-non-empty'
): T => {
  if (!savedData) return currentData;

  switch (mergeStrategy) {
    case 'prefer-saved':
      return { ...currentData, ...savedData };
    
    case 'prefer-current':
      return { ...savedData, ...currentData };
    
    case 'merge-non-empty':
    default:
      const merged = { ...currentData };
      
      Object.keys(savedData).forEach(key => {
        const savedValue = savedData[key as keyof T];
        const currentValue = currentData[key as keyof T];
        
        // Use saved value if current is empty/null/undefined
        if (savedValue !== null && savedValue !== undefined && savedValue !== '') {
          if (currentValue === null || currentValue === undefined || currentValue === '') {
            (merged as any)[key] = savedValue;
          } else if (Array.isArray(savedValue) && Array.isArray(currentValue)) {
            // For arrays, use the one with more items
            (merged as any)[key] = savedValue.length > currentValue.length ? savedValue : currentValue;
          }
        }
      });
      
      return merged;
  }
};

// Booking-specific utilities
export const saveBookingFormState = (
  formData: Partial<BookingFormData>,
  carId?: string
): boolean => {
  const formId = carId ? `booking_${carId}` : 'booking_general';
  return saveFormState(formId, formData, {
    storageKey: 'ramservis_booking',
    expirationHours: 48, // Booking forms expire after 48 hours
  });
};

export const loadBookingFormState = (carId?: string): Partial<BookingFormData> | null => {
  const formId = carId ? `booking_${carId}` : 'booking_general';
  return loadFormState<Partial<BookingFormData>>(formId, {
    storageKey: 'ramservis_booking',
    expirationHours: 48,
  });
};

export const clearBookingFormState = (carId?: string): boolean => {
  const formId = carId ? `booking_${carId}` : 'booking_general';
  return clearFormState(formId, {
    storageKey: 'ramservis_booking',
  });
};

export const hasBookingFormState = (carId?: string): boolean => {
  const formId = carId ? `booking_${carId}` : 'booking_general';
  return hasFormState(formId, {
    storageKey: 'ramservis_booking',
  });
};

// Auto-save hook for forms with callback support
export const createAutoSaveHandler = <T = any>(
  formId: string,
  options: FormStateOptions = {},
  onSave?: (success: boolean) => void
) => {
  let timeoutId: NodeJS.Timeout | null = null;
  const opts = { ...DEFAULT_OPTIONS, ...options };

  return (data: T) => {
    if (!opts.autoSave) return;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      const success = saveFormState(formId, data, options);
      if (onSave) {
        onSave(success);
      }
    }, opts.autoSaveDelay);
  };
};

/**
 * Enhanced form state with validation and metadata
 */
export const saveFormStateWithValidation = <T = any>(
  formId: string,
  data: T,
  validation: {
    isValid: boolean;
    errors: string[];
    completionPercentage: number;
  },
  options: FormStateOptions = {}
): boolean => {
  try {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    const storageKey = `${opts.storageKey}_${formId}`;
    
    const persistedState: PersistedFormState<T> & {
      validation: typeof validation;
    } = {
      data,
      timestamp: Date.now(),
      version: FORM_STATE_VERSION,
      formId,
      validation,
    };

    localStorage.setItem(storageKey, JSON.stringify(persistedState));
    
    // Update index
    const indexKey = `${opts.storageKey}_index`;
    const existingIndex = JSON.parse(localStorage.getItem(indexKey) || '[]');
    const updatedIndex = [...existingIndex.filter((id: string) => id !== formId), formId];
    localStorage.setItem(indexKey, JSON.stringify(updatedIndex));
    
    return true;
  } catch (error) {
    console.warn('Failed to save form state with validation:', error);
    return false;
  }
};

/**
 * Load form state with validation data
 */
export const loadFormStateWithValidation = <T = any>(
  formId: string,
  options: FormStateOptions = {}
): {
  data: T | null;
  validation?: {
    isValid: boolean;
    errors: string[];
    completionPercentage: number;
  };
} => {
  try {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    const storageKey = `${opts.storageKey}_${formId}`;
    
    const stored = localStorage.getItem(storageKey);
    if (!stored) return { data: null };

    const persistedState = JSON.parse(stored);
    
    // Check expiration
    const now = Date.now();
    const expirationTime = persistedState.timestamp + (opts.expirationHours * 60 * 60 * 1000);
    
    if (now > expirationTime) {
      clearFormState(formId, options);
      return { data: null };
    }

    return {
      data: persistedState.data,
      validation: persistedState.validation
    };
  } catch (error) {
    console.warn('Failed to load form state with validation:', error);
    return { data: null };
  }
};

// Initialize form persistence (call this on app startup)
export const initializeFormPersistence = (options: FormStateOptions = {}): void => {
  // Clear expired states on initialization
  const clearedCount = clearExpiredFormStates(options);
  if (clearedCount > 0) {
    console.log(`Cleared ${clearedCount} expired form states`);
  }

  // Set up periodic cleanup (every hour)
  setInterval(() => {
    clearExpiredFormStates(options);
  }, 60 * 60 * 1000);
};

