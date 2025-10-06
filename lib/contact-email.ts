// Contact form email sistemi
import emailjs from '@emailjs/browser';
import { isValidEmail, getEmailValidationMessage } from './email-validation';

// EmailJS-i initialize et
if (typeof window !== 'undefined') {
  emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '');
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface ContactEmailResult {
  success: boolean;
  error?: string;
}

// Contact formu email göndərmə
export async function sendContactEmail(
  formData: ContactFormData,
  language: 'az' | 'en' | 'ru' = 'az'
): Promise<ContactEmailResult> {
  try {
    console.log('📧 Contact email göndərilir...');
    
    // Email validasiya
    const emailValidationError = getEmailValidationMessage(formData.email, language);
    if (emailValidationError) {
      throw new Error(emailValidationError);
    }

    // Konfiqurasiya yoxlanışı
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_BUSINESS; // Biznes template istifadə edirik
    
    if (!serviceId || !publicKey || !templateId) {
      throw new Error('EmailJS konfiqurasiyası natamam');
    }

    // Email məzmunu hazırla
    const emailContent = getContactEmailContent(formData, language);
    
    const templateParams = {
      to_email: 'info@ramservis.az', // Birbaşa hardcode
      subject: emailContent.subject,
      customer_name: formData.name,
      customer_email: formData.email,
      customer_phone: 'Qeyd edilməyib',
      car_info: 'Ümumi sorğu',
      pickup_date: 'N/A',
      dropoff_date: 'N/A',
      pickup_location: 'N/A',
      dropoff_location: 'N/A',
      total_days: 'N/A',
      total_price: 'N/A',
      payment_method: 'N/A',
      additional_services: 'N/A',
      special_requests: formData.message,
      confirmation_number: `CONTACT_${Date.now()}`,
    };
    
    console.log('📨 Contact email parametrləri:', templateParams);

    const result = await emailjs.send(
      serviceId,
      templateId,
      templateParams,
      publicKey
    );
    
    console.log('✅ Contact email göndərildi:', result);

    return { success: true };
    
  } catch (error) {
    console.error('❌ Contact email xətası:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Naməlum xəta',
    };
  }
}

// Contact email məzmunu
function getContactEmailContent(
  formData: ContactFormData,
  language: 'az' | 'en' | 'ru'
) {
  const content = {
    az: {
      subject: `📞 Yeni Əlaqə Mesajı - ${formData.name}`,
    },
    en: {
      subject: `📞 New Contact Message - ${formData.name}`,
    },
    ru: {
      subject: `📞 Новое контактное сообщение - ${formData.name}`,
    }
  };

  return content[language];
}