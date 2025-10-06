/**
 * Accessibility utilities for WCAG compliance and enhanced user experience
 */

// ARIA live region announcements
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Focus management utilities
export const trapFocus = (element: HTMLElement) => {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  };

  element.addEventListener('keydown', handleTabKey);
  firstElement?.focus();

  return () => {
    element.removeEventListener('keydown', handleTabKey);
  };
};

// Color contrast validation
export const validateColorContrast = (foreground: string, background: string): boolean => {
  // Simplified contrast ratio calculation
  const getLuminance = (color: string): number => {
    const rgb = color.match(/\d+/g);
    if (!rgb) return 0;
    
    const [r, g, b] = rgb.map(c => {
      const val = parseInt(c) / 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  
  return ratio >= 4.5; // WCAG AA standard
};

// Keyboard navigation helpers
export const handleArrowNavigation = (
  event: KeyboardEvent,
  items: HTMLElement[],
  currentIndex: number,
  onIndexChange: (index: number) => void,
  orientation: 'horizontal' | 'vertical' = 'horizontal'
) => {
  const { key } = event;
  let newIndex = currentIndex;

  if (orientation === 'horizontal') {
    if (key === 'ArrowLeft') newIndex = Math.max(0, currentIndex - 1);
    if (key === 'ArrowRight') newIndex = Math.min(items.length - 1, currentIndex + 1);
  } else {
    if (key === 'ArrowUp') newIndex = Math.max(0, currentIndex - 1);
    if (key === 'ArrowDown') newIndex = Math.min(items.length - 1, currentIndex + 1);
  }

  if (key === 'Home') newIndex = 0;
  if (key === 'End') newIndex = items.length - 1;

  if (newIndex !== currentIndex) {
    event.preventDefault();
    onIndexChange(newIndex);
    items[newIndex]?.focus();
  }
};

// Touch target size validation
export const validateTouchTarget = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect();
  const minSize = 44; // 44px minimum touch target size
  return rect.width >= minSize && rect.height >= minSize;
};

// Screen reader utilities
export const createScreenReaderText = (text: string): HTMLSpanElement => {
  const span = document.createElement('span');
  span.className = 'sr-only';
  span.textContent = text;
  return span;
};

// ARIA attributes helpers
export const setAriaAttributes = (element: HTMLElement, attributes: Record<string, string>) => {
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(`aria-${key}`, value);
  });
};

// Focus visible utilities
export const addFocusVisibleSupport = () => {
  let hadKeyboardEvent = true;
  const keyboardThrottleTimeout = 100;

  const pointerEvent = () => {
    hadKeyboardEvent = false;
  };

  const keyboardEvent = (e: KeyboardEvent) => {
    if (e.metaKey || e.altKey || e.ctrlKey) return;
    hadKeyboardEvent = true;
  };

  const focusEvent = (e: FocusEvent) => {
    const target = e.target as HTMLElement;
    if (hadKeyboardEvent || target.matches(':focus-visible')) {
      target.classList.add('focus-visible');
    }
  };

  const blurEvent = (e: FocusEvent) => {
    const target = e.target as HTMLElement;
    target.classList.remove('focus-visible');
  };

  document.addEventListener('keydown', keyboardEvent, true);
  document.addEventListener('mousedown', pointerEvent, true);
  document.addEventListener('pointerdown', pointerEvent, true);
  document.addEventListener('touchstart', pointerEvent, true);
  document.addEventListener('focus', focusEvent, true);
  document.addEventListener('blur', blurEvent, true);
};

// Reduced motion detection
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// High contrast mode detection
export const prefersHighContrast = (): boolean => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia('(prefers-contrast: high)').matches;
};