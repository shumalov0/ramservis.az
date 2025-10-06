// Rezervasiya idarəetmə sistemi
import { 
  sendInitialConfirmation, 
  sendBusinessNotification, 
  SimpleBookingData 
} from './simple-email-system';
import { getEmailValidationMessage } from './email-validation';

export interface BookingResult {
  success: boolean;
  confirmationNumber?: string;
  message: string;
  error?: string;
}

// Rezervasiya məlumatlarını işləmək
export async function handleBookingSubmission(
  formData: any,
  carDetails: any,
  language: 'az' | 'en' | 'ru' = 'az'
): Promise<BookingResult> {
  try {
    // Email validasiya
    const emailValidationError = getEmailValidationMessage(formData.email, language);
    if (emailValidationError) {
      throw new Error(emailValidationError);
    }

    // Form məlumatlarını sadələşdir
    const bookingData: SimpleBookingData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      carId: carDetails.id || 'unknown',
      carBrand: carDetails.brand || 'Unknown',
      carModel: carDetails.model || 'Unknown',
      pickupDate: formData.pickupDate,
      dropoffDate: formData.dropoffDate,
      pickupLocation: formData.pickupLocation,
      dropoffLocation: formData.dropoffLocation,
      totalDays: formData.totalDays || 1,
      totalPrice: formData.totalPrice || 0,
      additionalServices: formData.additionalServices || [],
      specialRequests: formData.specialRequests || '',
      paymentMethod: formData.paymentMethod || 'cash', // Ödəniş metodu əlavə et
    };

    console.log('📧 Rezervasiya emailləri göndərilir...');

    // 1. Müştəriyə ilkin təsdiq göndər
    const customerResult = await sendInitialConfirmation(bookingData, language);
    
    if (!customerResult.success) {
      throw new Error(`Müştəri emaili göndərilmədi: ${customerResult.error}`);
    }

    const confirmationNumber = customerResult.confirmationNumber!;

    // 2. Biznesə bildiriş göndər
    const businessResult = await sendBusinessNotification(bookingData, confirmationNumber);
    
    if (!businessResult.success) {
      console.warn('⚠️ Biznes emaili göndərilmədi:', businessResult.error);
      // Müştəri emaili göndərildiyinə görə, bu xəta kritik deyil
    }

    // 3. Rezervasiyanı verilənlər bazasına əlavə et (gələcəkdə)
    // await saveBookingToDatabase(bookingData, confirmationNumber);

    console.log(`✅ Rezervasiya uğurla yaradıldı: ${confirmationNumber}`);

    return {
      success: true,
      confirmationNumber,
      message: getSuccessMessage(language, confirmationNumber),
    };

  } catch (error) {
    console.error('❌ Rezervasiya xətası:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Naməlum xəta',
      message: getErrorMessage(language),
    };
  }
}

// Uğur mesajı
function getSuccessMessage(language: 'az' | 'en' | 'ru', confirmationNumber: string): string {
  const messages = {
    az: `🎉 Rezervasiyanız uğurla qəbul edildi!\n\nTəsdiq nömrəsi: ${confirmationNumber}\n\nMaşının mövcudluğunu yoxlayıb, ödəniş linki göndərəcəyik.\n\nEmail yoxlamağı unutmayın!`,
    en: `🎉 Your booking has been successfully received!\n\nConfirmation number: ${confirmationNumber}\n\nWe will check car availability and send payment link.\n\nDon't forget to check your email!`,
    ru: `🎉 Ваше бронирование успешно получено!\n\nНомер подтверждения: ${confirmationNumber}\n\nМы проверим наличие автомобиля и отправим ссылку для оплаты.\n\nНе забудьте проверить электронную почту!`
  };

  return messages[language];
}

// Xəta mesajı
function getErrorMessage(language: 'az' | 'en' | 'ru'): string {
  const messages = {
    az: '❌ Rezervasiya zamanı xəta baş verdi. Zəhmət olmasa yenidən cəhd edin və ya bizimlə əlaqə saxlayın.',
    en: '❌ An error occurred during booking. Please try again or contact us.',
    ru: '❌ Произошла ошибка при бронировании. Пожалуйста, попробуйте еще раз или свяжитесь с нами.'
  };

  return messages[language];
}

