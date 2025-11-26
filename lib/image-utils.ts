/**
 * Image loading utilities for handling external URLs and fallbacks
 */

export const DEFAULT_FALLBACK_IMAGE = '/cars/placeholder.svg';

export const FALLBACK_IMAGES = [
  '/cars/12.jpg',
  '/cars/search.jpg',
  '/cars/placeholder.svg',
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PGNpcmNsZSBjeD0iMjAwIiBjeT0iMTIwIiByPSI0MCIgZmlsbD0iI2Q1ZDlkZiIvPjxwYXRoIGQ9Im0xODAgMTEwIDEwIDEwIDIwLTIwIDEwIDEwdjI1SDE4MHoiIGZpbGw9IiNhN2I2YzIiLz48dGV4dCB4PSI1MCUiIHk9IjcwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2IiBmaWxsPSIjNjc3NDg5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5DYXIgSW1hZ2U8L3RleHQ+PC9zdmc+'
];


/**
 * Preload an image and return a promise
 */
export function preloadImage(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(src);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

/**
 * Try to load an image with fallbacks
 */
export async function loadImageWithFallback(src: string): Promise<string> {
  try {
    // Try original image first
    await preloadImage(src);
    return src;
  } catch (error) {
    console.warn(`Failed to load image: ${src}`, error);
    
    // Try fallback images
    for (const fallback of FALLBACK_IMAGES) {
      try {
        await preloadImage(fallback);
        return fallback;
      } catch (fallbackError) {
        console.warn(`Failed to load fallback image: ${fallback}`, fallbackError);
      }
    }
    
    // Return default fallback if all else fails
    return DEFAULT_FALLBACK_IMAGE;
  }
}

/**
 * Get a safe image source with immediate fallback
 */
export function getSafeImageSrc(src: string): string {
  // If it's already a local image or data URL, return as is
  if (src.startsWith('/') || src.startsWith('data:')) {
    return src;
  }
  
  // For external URLs, we'll handle them in the component
  return src;
}

/**
 * Check if an image URL is likely to work
 */
export function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  
  // Check for common image extensions
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i;
  
  // Check for data URLs
  const isDataUrl = url.startsWith('data:image/');
  
  // Check for local paths
  const isLocalPath = url.startsWith('/');
  
  // Check for valid HTTP(S) URLs with image extensions
  const isValidHttpUrl = (url.startsWith('http://') || url.startsWith('https://')) && imageExtensions.test(url);
  
  return isDataUrl || isLocalPath || isValidHttpUrl;
}

/**
 * Add cache busting parameter to URL
 */
export function addCacheBuster(url: string): string {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}t=${Date.now()}`;
}