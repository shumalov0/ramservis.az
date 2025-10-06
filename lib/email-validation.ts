// Email validasiya funksiyaları

// Fake email domainləri
const FAKE_DOMAINS = [
  'example.com',
  'test.com',
  'fake.com',
  'dummy.com',
  'sample.com',
  'placeholder.com',
  'tempmail.com',
  '10minutemail.com',
];

// Email ünvanının real olub-olmadığını yoxlayır
export function isValidEmail(email: string): boolean {
  // Əsas email formatı yoxlanışı
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return false;
  }

  // Domain-i çıxar
  const domain = email.split('@')[1]?.toLowerCase();
  
  // Fake domain yoxlanışı
  if (FAKE_DOMAINS.includes(domain)) {
    return false;
  }

  return true;
}

// Email ünvanının biznes email olub-olmadığını yoxlayır
export function isBusinessEmail(email: string): boolean {
  const businessDomains = [
    'ramservis.az',
    'gmail.com', // Müvəqqəti olaraq
  ];
  
  const domain = email.split('@')[1]?.toLowerCase();
  return businessDomains.includes(domain);
}

// Email validasiya mesajları
export function getEmailValidationMessage(email: string, language: 'az' | 'en' | 'ru' = 'az'): string | null {
  if (!email) {
    const messages = {
      az: 'Email ünvanı daxil edin',
      en: 'Please enter email address',
      ru: 'Введите адрес электронной почты'
    };
    return messages[language];
  }

  if (!isValidEmail(email)) {
    const domain = email.split('@')[1]?.toLowerCase();
    
    if (FAKE_DOMAINS.includes(domain)) {
      const messages = {
        az: 'Zəhmət olmasa real email ünvanı daxil edin',
        en: 'Please enter a real email address',
        ru: 'Пожалуйста, введите реальный адрес электронной почты'
      };
      return messages[language];
    }

    const messages = {
      az: 'Düzgün email ünvanı daxil edin',
      en: 'Please enter a valid email address',
      ru: 'Введите корректный адрес электронной почты'
    };
    return messages[language];
  }

  return null; // Email düzgündür
}

// Populyar email provayderləri
export const POPULAR_EMAIL_PROVIDERS = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'mail.ru',
  'yandex.com',
  'yandex.ru',
  'rambler.ru',
  'inbox.ru',
];

// Email provayderini təyin edir
export function getEmailProvider(email: string): string | null {
  const domain = email.split('@')[1]?.toLowerCase();
  
  if (POPULAR_EMAIL_PROVIDERS.includes(domain)) {
    return domain;
  }
  
  return null;
}