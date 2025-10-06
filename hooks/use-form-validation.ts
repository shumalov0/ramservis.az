import { useState, useCallback, useEffect } from 'react';
import { FormikErrors, FormikTouched } from 'formik';
import * as Yup from 'yup';
import {
  validateField,
  getFieldError,
  hasFieldError,
  formatErrorMessage,
  saveFormState,
  loadFormState,
  clearFormState,
  getFormValidationSummary,
  focusFirstErrorField,
  FormValidationError,
} from '@/lib/validation';

interface UseFormValidationOptions {
  schema: Yup.ObjectSchema<any>;
  formId?: string;
  lang?: string;
  persistState?: boolean;
  autoSave?: boolean;
  autoSaveDelay?: number;
}

interface UseFormValidationReturn {
  validateFieldAsync: (fieldName: string, value: any) => Promise<string | undefined>;
  getError: (fieldName: string, errors: FormikErrors<any>, touched: FormikTouched<any>) => string | undefined;
  hasError: (fieldName: string, errors: FormikErrors<any>, touched: FormikTouched<any>) => boolean;
  formatError: (error: string) => string;
  getValidationSummary: (errors: FormikErrors<any>, touched: FormikTouched<any>) => FormValidationError[];
  saveState: (formData: any) => void;
  loadState: <T>() => T | null;
  clearState: () => void;
  focusFirstError: (errors: FormikErrors<any>) => void;
}

export const useFormValidation = (options: UseFormValidationOptions): UseFormValidationReturn => {
  const {
    schema,
    formId = 'default',
    lang = 'az',
    persistState = false,
    autoSave = false,
    autoSaveDelay = 1000,
  } = options;

  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
    };
  }, [autoSaveTimeout]);

  const validateFieldAsync = useCallback(
    async (fieldName: string, value: any): Promise<string | undefined> => {
      return await validateField(fieldName, value, schema);
    },
    [schema]
  );

  const getError = useCallback(
    (fieldName: string, errors: FormikErrors<any>, touched: FormikTouched<any>): string | undefined => {
      const error = getFieldError(fieldName, errors, touched);
      return error ? formatErrorMessage(error, lang) : undefined;
    },
    [lang]
  );

  const hasError = useCallback(
    (fieldName: string, errors: FormikErrors<any>, touched: FormikTouched<any>): boolean => {
      return hasFieldError(fieldName, errors, touched);
    },
    []
  );

  const formatError = useCallback(
    (error: string): string => {
      return formatErrorMessage(error, lang);
    },
    [lang]
  );

  const getValidationSummary = useCallback(
    (errors: FormikErrors<any>, touched: FormikTouched<any>): FormValidationError[] => {
      return getFormValidationSummary(errors, touched);
    },
    []
  );

  const saveState = useCallback(
    (formData: any): void => {
      if (!persistState) return;
      
      if (autoSave && autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
      
      const saveAction = () => saveFormState(formId, formData);
      
      if (autoSave) {
        const timeout = setTimeout(saveAction, autoSaveDelay);
        setAutoSaveTimeout(timeout);
      } else {
        saveAction();
      }
    },
    [persistState, autoSave, autoSaveDelay, autoSaveTimeout, formId]
  );

  const loadState = useCallback(
    <T>(): T | null => {
      if (!persistState) return null;
      return loadFormState<T>(formId);
    },
    [persistState, formId]
  );

  const clearState = useCallback((): void => {
    if (!persistState) return;
    clearFormState(formId);
  }, [persistState, formId]);

  const focusFirstError = useCallback((errors: FormikErrors<any>): void => {
    focusFirstErrorField(errors);
  }, []);

  return {
    validateFieldAsync,
    getError,
    hasError,
    formatError,
    getValidationSummary,
    saveState,
    loadState,
    clearState,
    focusFirstError,
  };
};

// Hook for real-time field validation
export const useFieldValidation = (
  fieldName: string,
  schema: Yup.ObjectSchema<any>,
  debounceMs: number = 300
) => {
  const [error, setError] = useState<string | undefined>();
  const [isValidating, setIsValidating] = useState(false);
  const [validationTimeout, setValidationTimeout] = useState<NodeJS.Timeout | null>(null);

  const validateField = useCallback(
    async (value: any) => {
      if (validationTimeout) {
        clearTimeout(validationTimeout);
      }

      setIsValidating(true);

      const timeout = setTimeout(async () => {
        try {
          await schema.validateAt(fieldName, { [fieldName]: value });
          setError(undefined);
        } catch (err) {
          if (err instanceof Yup.ValidationError) {
            setError(err.message);
          }
        } finally {
          setIsValidating(false);
        }
      }, debounceMs);

      setValidationTimeout(timeout);
    },
    [fieldName, schema, debounceMs, validationTimeout]
  );

  useEffect(() => {
    return () => {
      if (validationTimeout) {
        clearTimeout(validationTimeout);
      }
    };
  }, [validationTimeout]);

  return {
    error,
    isValidating,
    validateField,
  };
};