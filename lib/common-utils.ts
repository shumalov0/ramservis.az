/**
 * Common utility functions used across components
 */

// Format currency with proper locale
export function formatCurrency(
  amount: number, 
  currency: string = '₼', 
  locale: string = 'az-AZ'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency === '₼' ? 'AZN' : 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
}

// Format date with proper locale
export function formatDate(
  date: string | Date,
  locale: string = 'az-AZ',
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  return dateObj.toLocaleDateString(locale, options || defaultOptions);
}

// Get relative time (e.g., "2 days ago", "in 3 hours")
export function getRelativeTime(
  date: string | Date,
  locale: string = 'az-AZ'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInMs = dateObj.getTime() - now.getTime();
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
  
  // Azerbaijani relative time
  if (locale === 'az-AZ') {
    if (diffInDays === 0) return 'Bugün';
    if (diffInDays === 1) return 'Sabah';
    if (diffInDays === -1) return 'Dünən';
    if (diffInDays > 0) return `${diffInDays} gün sonra`;
    return `${Math.abs(diffInDays)} gün əvvəl`;
  }
  
  // English relative time
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Tomorrow';
  if (diffInDays === -1) return 'Yesterday';
  if (diffInDays > 0) return `In ${diffInDays} days`;
  return `${Math.abs(diffInDays)} days ago`;
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

// Generate initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate phone number (basic)
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
}

// Generate random ID
export function generateId(prefix: string = ''): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${prefix}${timestamp}${randomStr}`;
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle function
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Deep clone object
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as unknown as T;
  if (typeof obj === 'object') {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
}

// Check if object is empty
export function isEmpty(obj: any): boolean {
  if (obj == null) return true;
  if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
}

// Capitalize first letter
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Convert to slug (URL-friendly string)
export function toSlug(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Get file extension
export function getFileExtension(filename: string): string {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Check if device is mobile
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

// Get browser info
export function getBrowserInfo(): { name: string; version: string } {
  if (typeof window === 'undefined') return { name: 'unknown', version: 'unknown' };
  
  const ua = navigator.userAgent;
  let name = 'unknown';
  let version = 'unknown';
  
  if (ua.includes('Chrome')) {
    name = 'Chrome';
    version = ua.match(/Chrome\/(\d+)/)?.[1] || 'unknown';
  } else if (ua.includes('Firefox')) {
    name = 'Firefox';
    version = ua.match(/Firefox\/(\d+)/)?.[1] || 'unknown';
  } else if (ua.includes('Safari')) {
    name = 'Safari';
    version = ua.match(/Version\/(\d+)/)?.[1] || 'unknown';
  } else if (ua.includes('Edge')) {
    name = 'Edge';
    version = ua.match(/Edge\/(\d+)/)?.[1] || 'unknown';
  }
  
  return { name, version };
}