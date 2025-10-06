/**
 * Navigation utilities for handling both client-side and static export navigation
 */

export const navigateTo = (url: string, forceReload = false) => {
  if (forceReload || typeof window === 'undefined') {
    // Use window.location for static exports or server-side
    window.location.href = url;
  } else {
    // Try Next.js router first, fallback to window.location
    try {
      const { useRouter } = require('next/navigation');
      const router = useRouter();
      router.push(url);
    } catch (error) {
      console.warn('Next.js router not available, using window.location');
      window.location.href = url;
    }
  }
};

export const isStaticExport = () => {
  // Check if we're in static export mode
  return process.env.NODE_ENV === 'production' && !process.env.NEXT_RUNTIME;
};

export const createNavigationHandler = (url: string) => {
  return (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (isStaticExport()) {
      window.location.href = url;
    } else {
      navigateTo(url);
    }
  };
};