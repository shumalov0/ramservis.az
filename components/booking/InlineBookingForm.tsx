"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Clock,
  Car,
} from "lucide-react";
import { EnhancedCar, BookingFormData } from "@/lib/types";
import { useBookingSummary } from "@/hooks/use-booking-summary";
import { AvailabilityChecker } from "./AvailabilityChecker";
import { PriceCalculator } from "./PriceCalculator";
import { handleBookingSubmission } from "@/lib/booking-handler";
import PersonalInfoForm from "@/components/forms/PersonalInfoForm";
import RentalDetailsForm from "@/components/forms/RentalDetailsForm";
import ServicesPaymentForm from "@/components/forms/ServicesPaymentForm";
// Removed animation imports for better performance

interface InlineBookingFormProps {
  car: EnhancedCar;
  onBookingSubmit: (data: BookingFormData) => Promise<void>;
  onCancel?: () => void;
  initialData?: Partial<BookingFormData>;
  showPriceCalculation?: boolean;
  currentLang?: string;
}

export default function InlineBookingForm({
  car,
  onBookingSubmit,
  onCancel,
  initialData = {},
  showPriceCalculation = true,
  currentLang = "az",
}: InlineBookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState<{
    available: boolean;
    message?: string;
  }>({ available: true });

  const {
    summaryState,
    priceBreakdown,
    isCalculatingPrice,
    updateFormData,
    resetFormData,
    saveCurrentData,
    validateForm,
    formatFormDataForSubmission,
    hasChanges,
  } = useBookingSummary({
    carId: car.id,
    car,
    autoSave: true,
    autoSaveDelay: 1500,
  });

  // Initialize form with car data and any initial data
  useEffect(() => {
    const initialFormData = {
      carId: car.id,
      ...initialData,
    };
    updateFormData(initialFormData);
  }, [car.id, initialData, updateFormData]);

  // Removed ESC key handler to prevent navigation interference

  // Cleanup effect to prevent memory leaks
  useEffect(() => {
    return () => {
      // Clean up any pending operations when component unmounts
      setIsSubmitting(false);
      setSubmitError(null);
      setShowConfirmation(false);
    };
  }, []);

  const handleAvailabilityChange = (available: boolean, message?: string) => {
    setAvailabilityStatus({ available, message });
  };

  const handleFormSubmit = async () => {
    const validation = validateForm();
    if (!validation.isValid) {
      setSubmitError("Zəhmət olmasa bütün tələb olunan sahələri doldurun");
      return;
    }

    if (!availabilityStatus.available) {
      setSubmitError("Seçilmiş tarixlər üçün avtomobil mövcud deyil");
      return;
    }

    const formData = formatFormDataForSubmission();
    if (!formData) {
      setSubmitError("Form məlumatlarında xəta var");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Use the new booking handler
      const carDetails = {
        id: car.id,
        brand: car.brand,
        model: car.model,
        year: car.year,
        image: car.image,
        dailyPrice: car.dailyPrice,
      };

      const result = await handleBookingSubmission(
        formData,
        carDetails,
        currentLang as 'az' | 'en' | 'ru'
      );

      if (!result.success) {
        throw new Error(result.error || 'Rezervasiya zamanı xəta baş verdi');
      }

      console.log('✅ Rezervasiya uğurla yaradıldı:', result.confirmationNumber);

      // Call the original onBookingSubmit handler
      await onBookingSubmit({
        ...formData,
        confirmationNumber: result.confirmationNumber,
      });

      setShowConfirmation(true);
      // Clear saved data after successful submission
      resetFormData();
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Rezervasiya zamanı xəta baş verdi"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    // Clean up any event listeners or timers
    setSubmitError(null);
    setIsSubmitting(false);
    if (onCancel) {
      onCancel();
    }
  };

  if (showConfirmation) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Rezervasiya Təsdiqləndi!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Rezervasiyanız uğurla qeydə alındı. Tezliklə sizinlə əlaqə
              saxlayacağıq.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-[#1a1a1a] rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Avtomobil:
              </span>
              <span className="font-medium">
                {car.brand} {car.model} ({car.year})
              </span>
            </div>
            {summaryState.formData.pickupDate && (
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-600 dark:text-gray-400">Tarix:</span>
                <span className="font-medium">
                  {summaryState.formData.pickupDate ? 
                    new Date(summaryState.formData.pickupDate).toISOString().split('T')[0] : ''
                  }{" "}
                  -{" "}
                  {summaryState.formData.dropoffDate &&
                    new Date(summaryState.formData.dropoffDate).toISOString().split('T')[0]}
                </span>
              </div>
            )}
            {priceBreakdown && (
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-600 dark:text-gray-400">
                  Ümumi məbləğ:
                </span>
                <span className="font-bold text-lg">
                  ${priceBreakdown.total}
                </span>
              </div>
            )}
          </div>

          <Button onClick={handleConfirmationClose} className="w-full">
            Bağla
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div
      className="max-w-4xl mx-auto space-y-6"
      onClick={(e) => {
        // Prevent event bubbling that might interfere with navigation
        e.stopPropagation();
      }}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Rezervasiya Et
        </h2>
        <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
          <Car className="h-4 w-4" />
          <span>
            {car.brand} {car.model} ({car.year})
          </span>
        </div>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Tamamlanma</span>
            <span className="text-sm text-gray-500">
              {summaryState.completionPercentage}%
            </span>
          </div>
          <Progress value={summaryState.completionPercentage} className="h-2" />

          {summaryState.lastSaved && (
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
              <Clock className="h-3 w-3" />
              <span>
                Son yadda saxlanma:{" "}
                {summaryState.lastSaved.toLocaleTimeString()}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error Alert */}
      {submitError && (
        <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 dark:text-red-200">
            {submitError}
          </AlertDescription>
        </Alert>
      )}

      {/* Availability Status */}
      {!availabilityStatus.available && availabilityStatus.message && (
        <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800 dark:text-yellow-200">
            {availabilityStatus.message}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                    1
                  </span>
                </div>
                Şəxsi Məlumatlar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PersonalInfoForm
                formData={summaryState.formData}
                onUpdate={updateFormData}
                currentLang={currentLang}
                errors={{}}
              />
            </CardContent>
          </Card>

          {/* Rental Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                    2
                  </span>
                </div>
                <Calendar className="h-4 w-4" />
                İcarə Təfərrüatları
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RentalDetailsForm
                formData={summaryState.formData}
                onUpdate={updateFormData}
                currentLang={currentLang}
                errors={{}}
                car={car}
              />

              {/* Availability Checker */}
              <div className="mt-4">
                <AvailabilityChecker
                  carId={car.id}
                  selectedDates={{
                    start: summaryState.formData.pickupDate
                      ? new Date(summaryState.formData.pickupDate)
                      : new Date(),
                    end: summaryState.formData.dropoffDate
                      ? new Date(summaryState.formData.dropoffDate)
                      : new Date(),
                  }}
                  onAvailabilityChange={handleAvailabilityChange}
                />
              </div>
            </CardContent>
          </Card>

          {/* Services & Payment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                    3
                  </span>
                </div>
                <CreditCard className="h-4 w-4" />
                Xidmətlər və Ödəniş
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ServicesPaymentForm
                formData={summaryState.formData}
                onUpdate={updateFormData}
                currentLang={currentLang}
                errors={{}}
                priceBreakdown={priceBreakdown}
              />
            </CardContent>
          </Card>
        </div>

        {/* Price Calculator Sidebar */}
        {showPriceCalculation && (
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <PriceCalculator
                car={car}
                bookingData={summaryState.formData}
                onPriceUpdate={() => {}}
                isCalculating={isCalculatingPrice}
                priceBreakdown={priceBreakdown}
              />
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex gap-2">
              {onCancel && (
                <Button variant="outline" onClick={onCancel}>
                  Ləğv et
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => saveCurrentData()}
                disabled={!hasChanges()}
              >
                Yadda saxla
              </Button>
            </div>

            <Button
              onClick={handleFormSubmit}
              disabled={
                !summaryState.isComplete ||
                isSubmitting ||
                !availabilityStatus.available
              }
              className="bg-amber-600 hover:bg-amber-700"
            >
              {isSubmitting
                ? "Göndərilir..."
                : summaryState.formData.paymentMethod === "online"
                ? "Ödənişə keç"
                : "Rezervasiyanı təsdiq et"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
