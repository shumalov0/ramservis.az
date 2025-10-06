'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Save, 
  RotateCcw, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { EnhancedCar } from '@/lib/types';
import { useTranslation } from '@/lib/translations';
import { useBookingSummary } from '@/hooks/use-booking-summary';
import BookingSummary from '@/components/BookingSummary';
import PersonalInfoForm from '@/components/forms/PersonalInfoForm';
import RentalDetailsForm from '@/components/forms/RentalDetailsForm';
import ServicesPaymentForm from '@/components/forms/ServicesPaymentForm';

interface EnhancedBookingFormProps {
  car: EnhancedCar | null;
  currentLang: string;
  onSubmit?: (formData: any) => void;
  onCancel?: () => void;
  initialStep?: number;
  showSummary?: boolean;
}

type FormStep = 'personal' | 'rental' | 'services' | 'summary';

const FORM_STEPS: FormStep[] = ['personal', 'rental', 'services', 'summary'];

export default function EnhancedBookingForm({
  car,
  currentLang,
  onSubmit,
  onCancel,
  initialStep = 0,
  showSummary = true
}: EnhancedBookingFormProps) {
  const t = useTranslation(currentLang);
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSaveNotification, setShowSaveNotification] = useState(false);

  const {
    summaryState,
    priceBreakdown,
    isCalculatingPrice,
    updateFormData,
    resetFormData,
    saveCurrentData,
    clearSavedData,
    validateForm,
    getCompletionStatus,
    formatFormDataForSubmission,
    hasChanges
  } = useBookingSummary({
    carId: car?.id,
    car,
    autoSave: true,
    autoSaveDelay: 2000,
    onFormChange: (formData) => {
      // Handle form changes if needed
    },
    onValidationChange: (isValid, errors) => {
      // Handle validation changes if needed
    }
  });

  const currentStepName = FORM_STEPS[currentStep];
  const completionStatus = getCompletionStatus();

  // Auto-save notification
  useEffect(() => {
    if (summaryState.lastSaved && hasChanges()) {
      setShowSaveNotification(true);
      const timer = setTimeout(() => setShowSaveNotification(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [summaryState.lastSaved, hasChanges]);

  const handleStepChange = (step: number) => {
    if (step >= 0 && step < FORM_STEPS.length) {
      setCurrentStep(step);
    }
  };

  const handleNext = () => {
    if (currentStep < FORM_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = async () => {
    const success = saveCurrentData();
    if (success) {
      setShowSaveNotification(true);
      setTimeout(() => setShowSaveNotification(false), 3000);
    }
  };

  const handleReset = () => {
    if (confirm('Formu sıfırlamaq istədiyinizə əminsiniz?')) {
      resetFormData();
      setCurrentStep(0);
    }
  };

  const handleSubmit = async () => {
    const formData = formatFormDataForSubmission();
    if (!formData) {
      setSubmitError('Form məlumatlarında xəta var');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (onSubmit) {
        await onSubmit(formData);
      }
      
      // Clear saved data after successful submission
      clearSavedData();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Xəta baş verdi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSection = (section: string) => {
    const stepIndex = FORM_STEPS.indexOf(section as FormStep);
    if (stepIndex !== -1) {
      setCurrentStep(stepIndex);
    }
  };

  const isStepComplete = (step: FormStep): boolean => {
    switch (step) {
      case 'personal':
        return completionStatus.personal;
      case 'rental':
        return completionStatus.rental;
      case 'services':
        return true; // Services are optional
      case 'summary':
        return summaryState.isComplete;
      default:
        return false;
    }
  };

  const canProceedToNext = (): boolean => {
    return isStepComplete(FORM_STEPS[currentStep]);
  };

  // Prevent space key from triggering unwanted actions
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' && e.target === e.currentTarget) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8" onKeyDown={handleKeyDown}>
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white truncate">
              {t.onlineReservation}
            </h1>
            {car && (
              <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
                {car.brand} {car.model} ({car.year})
              </p>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-2">
            {summaryState.lastSaved && (
              <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 order-2 sm:order-1">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">
                  Son yadda saxlanma: {' '}
                  {summaryState.lastSaved.toLocaleTimeString()}
                </span>
                <span className="sm:hidden">
                  {summaryState.lastSaved.toLocaleTimeString()}
                </span>
              </div>
            )}
            
            <div className="flex gap-2 order-1 sm:order-2">
              <Button variant="outline" size="sm" onClick={handleSave} className="text-xs sm:text-sm">
                <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span className="hidden sm:inline">Yadda saxla</span>
                <span className="sm:hidden">Saxla</span>
              </Button>
              
              <Button variant="outline" size="sm" onClick={handleReset} className="text-xs sm:text-sm">
                <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span className="hidden sm:inline">Sıfırla</span>
                <span className="sm:hidden">Sıfırla</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>İrəliləyiş</span>
            <span>{summaryState.completionPercentage}%</span>
          </div>
          <Progress value={summaryState.completionPercentage} className="h-2" />
        </div>

        {/* Save Notification */}
        {showSaveNotification && (
          <Alert className="mt-4 border-green-200 bg-green-50 dark:bg-green-900/20">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              Form məlumatları yadda saxlanıldı
            </AlertDescription>
          </Alert>
        )}

        {/* Error Alert */}
        {submitError && (
          <Alert className="mt-4 border-red-200 bg-red-50 dark:bg-red-900/20">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 dark:text-red-200">
              {submitError}
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="text-lg sm:text-xl">
                  {currentStepName === 'personal' && t.personalInfo}
                  {currentStepName === 'rental' && t.rentalDetails}
                  {currentStepName === 'services' && 'Xidmətlər və Ödəniş'}
                  {currentStepName === 'summary' && 'Rezervasiyanı Yoxla'}
                </span>
                <div className="text-sm text-gray-500 self-start sm:self-center">
                  {currentStep + 1} / {FORM_STEPS.length}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <Tabs value={currentStepName} className="w-full">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto p-1">
                  {FORM_STEPS.map((step, index) => (
                    <TabsTrigger
                      key={step}
                      value={step}
                      onClick={() => handleStepChange(index)}
                      className="flex flex-col sm:flex-row items-center gap-1 p-2 sm:p-3 text-xs sm:text-sm min-h-[3rem] sm:min-h-[2.5rem]"
                      disabled={index > currentStep && !isStepComplete(FORM_STEPS[index - 1])}
                    >
                      {isStepComplete(step) && <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />}
                      <span className="text-center leading-tight">
                        {step === 'personal' && (
                          <>
                            <span className="block sm:hidden">Şəxsi</span>
                            <span className="hidden sm:inline">Şəxsi</span>
                          </>
                        )}
                        {step === 'rental' && (
                          <>
                            <span className="block sm:hidden">İcarə</span>
                            <span className="hidden sm:inline">İcarə</span>
                          </>
                        )}
                        {step === 'services' && (
                          <>
                            <span className="block sm:hidden">Xidmət</span>
                            <span className="hidden sm:inline">Xidmətlər</span>
                          </>
                        )}
                        {step === 'summary' && (
                          <>
                            <span className="block sm:hidden">Xülasə</span>
                            <span className="hidden sm:inline">Xülasə</span>
                          </>
                        )}
                      </span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="personal" className="mt-6">
                  <PersonalInfoForm
                    formData={summaryState.formData}
                    onUpdate={updateFormData}
                    currentLang={currentLang}
                    errors={{}}
                  />
                </TabsContent>

                <TabsContent value="rental" className="mt-6">
                  <RentalDetailsForm
                    formData={summaryState.formData}
                    onUpdate={updateFormData}
                    currentLang={currentLang}
                    errors={{}}
                    car={car}
                  />
                </TabsContent>

                <TabsContent value="services" className="mt-6">
                  <ServicesPaymentForm
                    formData={summaryState.formData}
                    onUpdate={updateFormData}
                    currentLang={currentLang}
                    errors={{}}
                    priceBreakdown={priceBreakdown}
                  />
                </TabsContent>

                <TabsContent value="summary" className="mt-6">
                  <div className="space-y-6">
                    <BookingSummary
                      formData={summaryState.formData}
                      car={car}
                      priceBreakdown={priceBreakdown || {
                        days: 0,
                        basePrice: 0,
                        locationCharges: 0,
                        serviceCharges: 0,
                        total: 0,
                        deposit: 0
                      }}
                      currentLang={currentLang}
                      onEdit={handleEditSection}
                      showActions={false}
                    />
                  </div>
                </TabsContent>
              </Tabs>

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="order-2 sm:order-1 w-full sm:w-auto"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Əvvəlki</span>
                  <span className="sm:hidden">Geri</span>
                </Button>

                <div className="flex flex-col sm:flex-row gap-2 order-1 sm:order-2 w-full sm:w-auto">
                  {onCancel && (
                    <Button variant="outline" onClick={onCancel} className="w-full sm:w-auto">
                      {t.cancel}
                    </Button>
                  )}

                  {currentStep < FORM_STEPS.length - 1 ? (
                    <Button
                      onClick={handleNext}
                      disabled={!canProceedToNext()}
                      className="w-full sm:w-auto"
                    >
                      <span className="hidden sm:inline">Növbəti</span>
                      <span className="sm:hidden">Növbəti</span>
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={!summaryState.isComplete || isSubmitting}
                      className="bg-amber-600 hover:bg-amber-700 w-full sm:w-auto"
                    >
                      <span className="text-center">
                        {isSubmitting
                          ? 'Göndərilir...'
                          : summaryState.formData.paymentMethod === 'online'
                          ? 'Ödənişə keç'
                          : 'Rezervasiyanı təsdiq et'
                        }
                      </span>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Summary */}
        {showSummary && (
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="lg:sticky lg:top-6">
              <BookingSummary
                formData={summaryState.formData}
                car={car}
                priceBreakdown={priceBreakdown || {
                  days: 0,
                  basePrice: 0,
                  locationCharges: 0,
                  serviceCharges: 0,
                  total: 0,
                  deposit: 0
                }}
                currentLang={currentLang}
                onEdit={handleEditSection}
                showActions={false}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}