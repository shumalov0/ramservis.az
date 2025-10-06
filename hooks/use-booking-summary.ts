import { useState, useEffect, useCallback, useMemo } from "react";
import { BookingFormData, EnhancedCar } from "@/lib/types";
import {
  saveBookingFormState,
  loadBookingFormState,
  clearBookingFormState,
  hasBookingFormState,
  mergeFormState,
  createAutoSaveHandler,
  saveFormStateWithValidation,
  loadFormStateWithValidation,
} from "@/lib/form-persistence";
import { usePriceCalculation } from "@/hooks/use-price-calculation";

export interface BookingSummaryState {
  formData: Partial<BookingFormData>;
  isComplete: boolean;
  completionPercentage: number;
  missingFields: string[];
  hasUnsavedChanges: boolean;
  lastSaved: Date | null;
}

export interface UseBookingSummaryOptions {
  carId?: string;
  car?: EnhancedCar | null;
  autoSave?: boolean;
  autoSaveDelay?: number;
  onFormChange?: (formData: Partial<BookingFormData>) => void;
  onValidationChange?: (isValid: boolean, errors: string[]) => void;
}

export interface UseBookingSummaryReturn {
  // State
  summaryState: BookingSummaryState;
  priceBreakdown: any;
  isCalculatingPrice: boolean;

  // Form data management
  updateFormData: (updates: Partial<BookingFormData>) => void;
  resetFormData: () => void;
  loadSavedData: () => boolean;
  saveCurrentData: () => boolean;
  clearSavedData: () => boolean;

  // Validation
  validateForm: () => { isValid: boolean; errors: string[] };
  validateField: (
    fieldName: keyof BookingFormData,
    value: any
  ) => string | null;

  // Utilities
  getCompletionStatus: () => {
    personal: boolean;
    rental: boolean;
    payment: boolean;
    car: boolean;
  };
  formatFormDataForSubmission: () => BookingFormData | null;
  hasChanges: () => boolean;
}

const REQUIRED_FIELDS: Array<keyof BookingFormData> = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "carId",
  "pickupDate",
  "dropoffDate",
  "pickupLocation",
  "dropoffLocation",
  "paymentMethod",
];

const FIELD_LABELS: Record<keyof BookingFormData, string> = {
  firstName: "Ad",
  lastName: "Soyad",
  email: "E-mail",
  phone: "Telefon",
  carId: "Avtomobil",
  pickupDate: "Götürülmə tarixi",
  dropoffDate: "Qaytarılma tarixi",
  pickupLocation: "Götürülmə yeri",
  dropoffLocation: "Qaytarılma yeri",
  paymentMethod: "Ödəniş üsulu",
  additionalServices: "Əlavə xidmətlər",
  specialRequests: "Xüsusi istəklər",
  totalDays: "Ümumi günlər",
  totalPrice: "Ümumi qiymət",
  deposit: "Depozit",
  serviceCharges: "Xidmət haqqı",
  confirmationNumber: "Təsdiq nömrəsi",
  paymentLink: "Ödəniş linki",
};

export const useBookingSummary = (
  options: UseBookingSummaryOptions = {}
): UseBookingSummaryReturn => {
  const {
    carId,
    car,
    autoSave = true,
    autoSaveDelay = 2000,
    onFormChange,
    onValidationChange,
  } = options;

  // State
  const [formData, setFormData] = useState<Partial<BookingFormData>>({
    additionalServices: [],
    paymentMethod: "cash",
  });
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [initialData, setInitialData] = useState<Partial<BookingFormData>>({});

  // Price calculation
  const {
    priceBreakdown,
    isCalculating: isCalculatingPrice,
    calculatePrice,
  } = usePriceCalculation({
    carId: formData.carId || carId,
    pickupDate: formData.pickupDate,
    dropoffDate: formData.dropoffDate,
    pickupLocation: formData.pickupLocation,
    dropoffLocation: formData.dropoffLocation,
    additionalServices: formData.additionalServices,
    paymentMethod: formData.paymentMethod,
    autoCalculate: true,
  });

  // Auto-save handler
  const autoSaveHandler = useMemo(
    () =>
      createAutoSaveHandler(`booking_${carId || "general"}`, {
        storageKey: "ramservis_booking",
        autoSave,
        autoSaveDelay,
      }),
    [carId, autoSave, autoSaveDelay]
  );

  // Load saved data on mount
  useEffect(() => {
    const savedData = loadBookingFormState(carId);
    if (savedData) {
      const mergedData = mergeFormState(formData, savedData);
      setFormData(mergedData);
      setInitialData(mergedData);
      setLastSaved(new Date());
    }

    // Set car ID if provided
    if (carId && !formData.carId) {
      setFormData((prev) => ({ ...prev, carId }));
    }
  }, [carId]);

  // Validation functions (defined before useEffect that uses them)
  const validateField = useCallback(
    (fieldName: keyof BookingFormData, value: any): string | null => {
      switch (fieldName) {
        case "firstName":
        case "lastName":
          if (!value || value.trim().length < 2) {
            return `${FIELD_LABELS[fieldName]} minimum 2 simvol olmalıdır`;
          }
          if (!/^[a-zA-ZəüöğıçşƏÜÖĞIÇŞ\s'-]+$/.test(value)) {
            return `${FIELD_LABELS[fieldName]} yalnız hərflər olmalıdır`;
          }
          break;

        case "email":
          if (!value) {
            return "E-mail tələb olunur";
          }
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return "Düzgün e-mail formatı daxil edin";
          }
          break;

        case "phone":
          if (!value) {
            return "Telefon nömrəsi tələb olunur";
          }
          if (
            !/^(\+994|994|0)?(50|51|55|70|77|99|10|12)\d{7}$/.test(
              value.replace(/\s/g, "")
            )
          ) {
            return "Düzgün telefon nömrəsi daxil edin";
          }
          break;

        case "pickupDate":
        case "dropoffDate":
          if (!value) {
            return `${FIELD_LABELS[fieldName]} tələb olunur`;
          }
          const date = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (date < today) {
            return "Tarix bugündən əvvəl ola bilməz";
          }
          break;

        case "dropoffDate":
          if (value && formData.pickupDate) {
            const pickup = new Date(formData.pickupDate);
            const dropoff = new Date(value);
            if (dropoff <= pickup) {
              return "Qaytarılma tarixi götürülmə tarixindən sonra olmalıdır";
            }
            const diffTime = dropoff.getTime() - pickup.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays < 2) {
              return "Minimum kirayə müddəti 2 gündür";
            }
          }
          break;

        case "pickupLocation":
        case "dropoffLocation":
          if (!value) {
            return `${FIELD_LABELS[fieldName]} seçin`;
          }
          break;

        case "paymentMethod":
          if (!value || !["cash", "online"].includes(value)) {
            return "Ödəniş üsulu seçin";
          }
          break;
      }

      return null;
    },
    [formData]
  );
  const validateForm = useCallback((): {
    isValid: boolean;
    errors: string[];
  } => {
    const errors: string[] = [];

    REQUIRED_FIELDS.forEach((field) => {
      const value = formData[field];
      const error = validateField(field, value);
      if (error) {
        errors.push(error);
      }
    });

    // Additional validation for rental period
    if (formData.pickupDate && formData.dropoffDate) {
      const pickup = new Date(formData.pickupDate);
      const dropoff = new Date(formData.dropoffDate);
      const diffTime = dropoff.getTime() - pickup.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 2) {
        errors.push("Minimum kirayə müddəti 2 gündür");
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }, [formData, validateField]);

  // Auto-save when form data changes
  useEffect(() => {
    if (hasUnsavedChanges && autoSave) {
      const validation = validateForm();
      const completion = getCompletionStatus();
      const completedSections =
        Object.values(completion).filter(Boolean).length;
      const totalSections = Object.keys(completion).length;
      const completionPercentage = Math.round(
        (completedSections / totalSections) * 100
      );

      // Save with validation metadata
      const success = saveFormStateWithValidation(
        `booking_${carId || "general"}`,
        formData,
        {
          isValid: validation.isValid,
          errors: validation.errors,
          completionPercentage,
        },
        {
          storageKey: "ramservis_booking",
          expirationHours: 48,
        }
      );

      if (success) {
        setLastSaved(new Date());
        setHasUnsavedChanges(false);
      }
    }
  }, [
    formData,
    hasUnsavedChanges,
    autoSave,
    carId,
    validateForm,
  ]);

  // Calculate completion status
  const getCompletionStatus = useCallback(() => {
    return {
      personal: !!(
        formData.firstName &&
        formData.lastName &&
        formData.email &&
        formData.phone
      ),
      rental: !!(
        formData.pickupDate &&
        formData.dropoffDate &&
        formData.pickupLocation &&
        formData.dropoffLocation
      ),
      payment: !!formData.paymentMethod,
      car: !!(formData.carId || carId),
    };
  }, [formData, carId]);

  // Calculate summary state
  const summaryState = useMemo((): BookingSummaryState => {
    const validation = validateForm();
    const completion = getCompletionStatus();
    const completedSections = Object.values(completion).filter(Boolean).length;
    const totalSections = Object.keys(completion).length;

    const missingFields = REQUIRED_FIELDS.filter((field) => {
      const value = formData[field];
      return !value || (typeof value === "string" && value.trim() === "");
    });

    return {
      formData,
      isComplete: validation.isValid,
      completionPercentage: Math.round(
        (completedSections / totalSections) * 100
      ),
      missingFields: missingFields.map((field) => FIELD_LABELS[field]),
      hasUnsavedChanges,
      lastSaved,
    };
  }, [
    formData,
    validateForm,
    getCompletionStatus,
    hasUnsavedChanges,
    lastSaved,
  ]);

  // Form data management functions
  const updateFormData = useCallback(
    (updates: Partial<BookingFormData>) => {
      setFormData((prev) => {
        const newData = { ...prev, ...updates };

        // Calculate derived fields
        if (updates.pickupDate || updates.dropoffDate) {
          if (newData.pickupDate && newData.dropoffDate) {
            const pickup = new Date(newData.pickupDate);
            const dropoff = new Date(newData.dropoffDate);
            const diffTime = dropoff.getTime() - pickup.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            newData.totalDays = diffDays;
          }
        }

        return newData;
      });

      setHasUnsavedChanges(true);

      if (onFormChange) {
        onFormChange({ ...formData, ...updates });
      }
    },
    [formData, onFormChange]
  );

  const resetFormData = useCallback(() => {
    const resetData: Partial<BookingFormData> = {
      additionalServices: [],
      paymentMethod: "cash",
    };

    if (carId) {
      resetData.carId = carId;
    }

    setFormData(resetData);
    setInitialData(resetData);
    setHasUnsavedChanges(false);
    clearBookingFormState(carId);
  }, [carId]);

  const loadSavedData = useCallback((): boolean => {
    const savedData = loadBookingFormState(carId);
    if (savedData) {
      setFormData(savedData);
      setInitialData(savedData);
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      return true;
    }
    return false;
  }, [carId]);

  const saveCurrentData = useCallback((): boolean => {
    const success = saveBookingFormState(formData, carId);
    if (success) {
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
    }
    return success;
  }, [formData, carId]);

  const clearSavedData = useCallback((): boolean => {
    const success = clearBookingFormState(carId);
    if (success) {
      setLastSaved(null);
      setHasUnsavedChanges(false);
    }
    return success;
  }, [carId]);

  const formatFormDataForSubmission =
    useCallback((): BookingFormData | null => {
      const validation = validateForm();
      if (!validation.isValid) {
        return null;
      }

      // Ensure all required fields are present and calculate derived fields
      const submissionData: BookingFormData = {
        firstName: formData.firstName!,
        lastName: formData.lastName!,
        email: formData.email!,
        phone: formData.phone!,
        carId: formData.carId || carId!,
        pickupDate: formData.pickupDate!,
        dropoffDate: formData.dropoffDate!,
        pickupLocation: formData.pickupLocation!,
        dropoffLocation: formData.dropoffLocation!,
        additionalServices: formData.additionalServices || [],
        paymentMethod: formData.paymentMethod!,
        specialRequests: formData.specialRequests || "",
        totalDays: formData.totalDays || 0,
        totalPrice: priceBreakdown?.total || 0,
        deposit: priceBreakdown?.deposit || 0,
        serviceCharges: priceBreakdown?.serviceCharges || 0,
      };

      return submissionData;
    }, [formData, carId, validateForm, priceBreakdown]);

  const hasChanges = useCallback((): boolean => {
    return JSON.stringify(formData) !== JSON.stringify(initialData);
  }, [formData, initialData]);

  // Notify about validation changes
  useEffect(() => {
    if (onValidationChange) {
      const validation = validateForm();
      onValidationChange(validation.isValid, validation.errors);
    }
  }, [formData, onValidationChange, validateForm]);

  return {
    // State
    summaryState,
    priceBreakdown,
    isCalculatingPrice,

    // Form data management
    updateFormData,
    resetFormData,
    loadSavedData,
    saveCurrentData,
    clearSavedData,

    // Validation
    validateForm,
    validateField,

    // Utilities
    getCompletionStatus,
    formatFormDataForSubmission,
    hasChanges,
  };
};
