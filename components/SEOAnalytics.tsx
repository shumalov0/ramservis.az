'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export default function SEOAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    // Google Analytics page view tracking
    if (typeof window.gtag !== 'undefined') {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        page_path: pathname,
      });
    }

    // Core Web Vitals tracking
    if ('web-vital' in window) {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS((metric) => {
          if (typeof window.gtag !== 'undefined') {
            window.gtag('event', 'web_vital', {
              event_category: 'Web Vitals',
              event_label: metric.name,
              value: Math.round(metric.value),
              non_interaction: true,
            });
          }
        });

        getFID((metric) => {
          if (typeof window.gtag !== 'undefined') {
            window.gtag('event', 'web_vital', {
              event_category: 'Web Vitals',
              event_label: metric.name,
              value: Math.round(metric.value),
              non_interaction: true,
            });
          }
        });

        getFCP((metric) => {
          if (typeof window.gtag !== 'undefined') {
            window.gtag('event', 'web_vital', {
              event_category: 'Web Vitals',
              event_label: metric.name,
              value: Math.round(metric.value),
              non_interaction: true,
            });
          }
        });

        getLCP((metric) => {
          if (typeof window.gtag !== 'undefined') {
            window.gtag('event', 'web_vital', {
              event_category: 'Web Vitals',
              event_label: metric.name,
              value: Math.round(metric.value),
              non_interaction: true,
            });
          }
        });

        getTTFB((metric) => {
          if (typeof window.gtag !== 'undefined') {
            window.gtag('event', 'web_vital', {
              event_category: 'Web Vitals',
              event_label: metric.name,
              value: Math.round(metric.value),
              non_interaction: true,
            });
          }
        });
      });
    }
  }, [pathname]);

  return null;
}