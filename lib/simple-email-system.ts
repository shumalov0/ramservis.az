// Sadələşdirilmiş Email Sistemi - Manual İdarəetmə üçün
import emailjs from '@emailjs/browser';

// EmailJS-i initialize et
if (typeof window !== 'undefined') {
  emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '');
}

export interface SimpleBookingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  carId: string;
  carBrand: string;
  carModel: string;
  pickupDate: string;
  dropoffDate: string;
  pickupLocation: string;
  dropoffLocation: string;
  totalDays: number;
  totalPrice: number;
  additionalServices?: string[];
  specialRequests?: string;
  paymentMethod?: 'cash' | 'online';
}

export interface EmailResult {
  success: boolean;
  error?: string;
  confirmationNumber?: string;
}

// Təsdiq nömrəsi yaratmaq
export function generateConfirmationNumber(): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `RS${timestamp}${random}`;
}

// 1. Müştəriyə ilkin təsdiq emaili (ödəniş linki olmadan)
export async function sendInitialConfirmation(
  bookingData: SimpleBookingData,
  language: 'az' | 'en' | 'ru' = 'az'
): Promise<EmailResult> {
  try {
    console.log('🔧 EmailJS konfiqurasiyası yoxlanılır...');
    
    // Konfiqurasiya yoxlanışı
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_CUSTOMER;
    
    console.log('📋 Konfiqurasiya:', {
      serviceId: serviceId ? '✅' : '❌',
      publicKey: publicKey ? '✅' : '❌',
      templateId: templateId ? '✅' : '❌'
    });
    
    if (!serviceId || !publicKey || !templateId) {
      throw new Error('EmailJS konfiqurasiyası natamam. .env.local faylını yoxlayın.');
    }
    
    const confirmationNumber = generateConfirmationNumber();
    console.log('📧 Təsdiq nömrəsi yaradıldı:', confirmationNumber);
    
    const emailContent = getInitialConfirmationContent(bookingData, confirmationNumber, language);
    
    const templateParams = {
      to_email: bookingData.email,
      to_name: `${bookingData.firstName} ${bookingData.lastName}`,
      subject: emailContent.subject,
      message: emailContent.message,
      confirmation_number: confirmationNumber,
      car_info: `${bookingData.carBrand} ${bookingData.carModel}`,
      pickup_date: bookingData.pickupDate,
      dropoff_date: bookingData.dropoffDate,
      total_price: bookingData.totalPrice,
      company_name: 'Ram Servis',
      company_phone: process.env.NEXT_PUBLIC_COMPANY_PHONE || '+994707004444',
    };
    
    console.log('📨 Email parametrləri:', templateParams);
    console.log('🎯 Biznes emaili:', process.env.BUSINESS_EMAIL);
    console.log('🚀 EmailJS-ə göndərilir...');

    const result = await emailjs.send(
      serviceId,
      templateId,
      templateParams,
      publicKey
    );
    
    console.log('✅ EmailJS cavabı:', result);

    return {
      success: true,
      confirmationNumber,
    };
  } catch (error) {
    console.error('❌ İlkin təsdiq emaili xətası:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Naməlum xəta',
    };
  }
}

// 2. Biznesə yeni rezervasiya bildirişi
export async function sendBusinessNotification(
  bookingData: SimpleBookingData,
  confirmationNumber: string
): Promise<EmailResult> {
  try {
    console.log('🏢 Biznes emaili göndərilir...');
    console.log('🎯 Hədəf email:', process.env.BUSINESS_EMAIL || 'info@ramservis.az');
    
    const templateParams = {
      to_email: 'info@ramservis.az', // Birbaşa hardcode
      subject: `🚗 Yeni Rezervasiya - ${confirmationNumber}`,
      customer_name: `${bookingData.firstName} ${bookingData.lastName}`,
      customer_email: bookingData.email,
      customer_phone: bookingData.phone,
      car_info: `${bookingData.carBrand} ${bookingData.carModel}`,
      pickup_date: bookingData.pickupDate,
      dropoff_date: bookingData.dropoffDate,
      pickup_location: bookingData.pickupLocation,
      dropoff_location: bookingData.dropoffLocation,
      total_days: bookingData.totalDays,
      total_price: bookingData.totalPrice,
      payment_method: bookingData.paymentMethod === 'cash' ? 'Nağd' : 'Online',
      additional_services: bookingData.additionalServices?.join(', ') || 'Yoxdur',
      special_requests: bookingData.specialRequests || 'Yoxdur',
      confirmation_number: confirmationNumber,
    };

    await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_BUSINESS!,
      templateParams,
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
    );

    return { success: true };
  } catch (error) {
    console.error('Biznes bildirişi göndərilmədi:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Naməlum xəta',
    };
  }
}

// 3. Müştəriyə ödəniş linki göndərmək (manual)
export async function sendPaymentLink(
  customerEmail: string,
  customerName: string,
  confirmationNumber: string,
  paymentLink: string,
  totalAmount: number,
  language: 'az' | 'en' | 'ru' = 'az'
): Promise<EmailResult> {
  try {
    const emailContent = getPaymentEmailContent(
      customerName,
      confirmationNumber,
      paymentLink,
      totalAmount,
      language
    );

    const templateParams = {
      to_email: customerEmail,
      to_name: customerName,
      subject: emailContent.subject,
      message: emailContent.message,
      confirmation_number: confirmationNumber,
      total_amount: totalAmount,
      company_name: 'Ram Servis',
      company_phone: process.env.NEXT_PUBLIC_COMPANY_PHONE || '+994707004444',
    };

    // Müştəri template-ini istifadə edirik (ödəniş linki üçün ayrı template yoxdur)
    await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_CUSTOMER!,
      templateParams,
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
    );

    return { success: true };
  } catch (error) {
    console.error('Ödəniş linki göndərilmədi:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Naməlum xəta',
    };
  }
}

// İlkin təsdiq email məzmunu
function getInitialConfirmationContent(
  bookingData: SimpleBookingData,
  confirmationNumber: string,
  language: 'az' | 'en' | 'ru'
) {
  const content = {
    az: {
      subject: `🚗 Rezervasiya Qəbul Edildi - ${confirmationNumber}`,
      message: `
Hörmətli ${bookingData.firstName} ${bookingData.lastName},

Rezervasiyanız uğurla qəbul edildi!

📋 Rezervasiya Məlumatları:
• Təsdiq Nömrəsi: ${confirmationNumber}
• Maşın: ${bookingData.carBrand} ${bookingData.carModel}
• Götürmə Tarixi: ${bookingData.pickupDate}
• Qaytarma Tarixi: ${bookingData.dropoffDate}
• Götürmə Yeri: ${bookingData.pickupLocation}
• Qaytarma Yeri: ${bookingData.dropoffLocation}
• Ümumi Məbləğ: ${bookingData.totalPrice} AZN

⏳ Növbəti Addımlar:
1. Maşının mövcudluğunu yoxlayacağıq
2. Təsdiq edildikdən sonra ödəniş linki göndərəcəyik
3. Ödənişdən sonra rezervasiya tam təsdiqlənəcək

📞 Əlaqə: ${process.env.NEXT_PUBLIC_COMPANY_PHONE || '+994501234567'}

Təşəkkürlər,
Ram Servis Komandası
      `
    },
    en: {
      subject: `🚗 Booking Received - ${confirmationNumber}`,
      message: `
Dear ${bookingData.firstName} ${bookingData.lastName},

Your booking has been successfully received!

📋 Booking Details:
• Confirmation Number: ${confirmationNumber}
• Car: ${bookingData.carBrand} ${bookingData.carModel}
• Pickup Date: ${bookingData.pickupDate}
• Return Date: ${bookingData.dropoffDate}
• Pickup Location: ${bookingData.pickupLocation}
• Return Location: ${bookingData.dropoffLocation}
• Total Amount: ${bookingData.totalPrice} AZN

⏳ Next Steps:
1. We will check car availability
2. Payment link will be sent after confirmation
3. Booking will be fully confirmed after payment

📞 Contact: ${process.env.NEXT_PUBLIC_COMPANY_PHONE || '+994501234567'}

Thank you,
Ram Servis Team
      `
    },
    ru: {
      subject: `🚗 Бронирование Получено - ${confirmationNumber}`,
      message: `
Уважаемый ${bookingData.firstName} ${bookingData.lastName},

Ваше бронирование успешно получено!

📋 Детали Бронирования:
• Номер Подтверждения: ${confirmationNumber}
• Автомобиль: ${bookingData.carBrand} ${bookingData.carModel}
• Дата Получения: ${bookingData.pickupDate}
• Дата Возврата: ${bookingData.dropoffDate}
• Место Получения: ${bookingData.pickupLocation}
• Место Возврата: ${bookingData.dropoffLocation}
• Общая Сумма: ${bookingData.totalPrice} AZN

⏳ Следующие Шаги:
1. Проверим наличие автомобиля
2. Отправим ссылку для оплаты после подтверждения
3. Бронирование будет полностью подтверждено после оплаты

📞 Контакт: ${process.env.NEXT_PUBLIC_COMPANY_PHONE || '+994501234567'}

Спасибо,
Команда Ram Servis
      `
    }
  };

  return content[language];
}

// Ödəniş email məzmunu
function getPaymentEmailContent(
  customerName: string,
  confirmationNumber: string,
  paymentLink: string,
  totalAmount: number,
  language: 'az' | 'en' | 'ru'
) {
  const content = {
    az: {
      subject: `💳 Ödəniş Linki - ${confirmationNumber}`,
      message: `
Hörmətli ${customerName},

Maşının mövcudluğu təsdiqləndi! İndi ödəniş edə bilərsiniz.

💳 Ödəniş Məlumatları:
• Təsdiq Nömrəsi: ${confirmationNumber}
• Ödəniləcək Məbləğ: ${totalAmount} AZN

🔗 Ödəniş Linki:
${paymentLink}

⚠️ Qeyd: Ödəniş linkinin müddəti 24 saatdır.

📞 Suallarınız üçün: ${process.env.NEXT_PUBLIC_COMPANY_PHONE || '+994501234567'}

Təşəkkürlər,
Ram Servis Komandası
      `
    },
    en: {
      subject: `💳 Payment Link - ${confirmationNumber}`,
      message: `
Dear ${customerName},

Car availability confirmed! You can now proceed with payment.

💳 Payment Details:
• Confirmation Number: ${confirmationNumber}
• Amount to Pay: ${totalAmount} AZN

🔗 Payment Link:
${paymentLink}

⚠️ Note: Payment link expires in 24 hours.

📞 For questions: ${process.env.NEXT_PUBLIC_COMPANY_PHONE || '+994501234567'}

Thank you,
Ram Servis Team
      `
    },
    ru: {
      subject: `💳 Ссылка для Оплаты - ${confirmationNumber}`,
      message: `
Уважаемый ${customerName},

Наличие автомобиля подтверждено! Теперь вы можете произвести оплату.

💳 Детали Оплаты:
• Номер Подтверждения: ${confirmationNumber}
• Сумма к Оплате: ${totalAmount} AZN

🔗 Ссылка для Оплаты:
${paymentLink}

⚠️ Примечание: Ссылка действительна 24 часа.

📞 По вопросам: ${process.env.NEXT_PUBLIC_COMPANY_PHONE || '+994501234567'}

Спасибо,
Команда Ram Servis
      `
    }
  };

  return content[language];
}