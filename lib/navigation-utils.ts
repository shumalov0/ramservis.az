/**
 * Navigation utilities for handling both client-side and static export navigation
 */

export const navigateTo = (url: string, forceReload = false) => {
  if (typeof window === 'undefined') return;
  
  // Always use window.location for reliable navigation
  window.location.href = url;
};

export const isStaticExport = () => {
  // Check if we're in static export mode
  return process.env.NODE_ENV === 'production' && !process.env.NEXT_RUNTIME;
};

export const createNavigationHandler = (url: string) => {
  return (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Use a small delay to ensure any modal/sheet closes first
    setTimeout(() => {
      window.location.href = url;
    }, 100);
  };
};