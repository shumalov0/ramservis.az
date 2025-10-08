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
    if (typeof window !== 'undefined') {
      import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
        onCLS((metric) => {
          if (typeof window.gtag !== 'undefined') {
            window.gtag('event', 'web_vital', {
              event_category: 'Web Vitals',
              event_label: metric.name,
              value: Math.round(metric.value),
              non_interaction: true,
            });
          }
        });

        onINP((metric) => {
          if (typeof window.gtag !== 'undefined') {
            window.gtag('event', 'web_vital', {
              event_category: 'Web Vitals',
              event_label: metric.name,
              value: Math.round(metric.value),
              non_interaction: true,
            });
          }
        });

        onFCP((metric) => {
          if (typeof window.gtag !== 'undefined') {
            window.gtag('event', 'web_vital', {
              event_category: 'Web Vitals',
              event_label: metric.name,
              value: Math.round(metric.value),
              non_interaction: true,
            });
          }
        });

        onLCP((metric) => {
          if (typeof window.gtag !== 'undefined') {
            window.gtag('event', 'web_vital', {
              event_category: 'Web Vitals',
              event_label: metric.name,
              value: Math.round(metric.value),
              non_interaction: true,
            });
          }
        });

        onTTFB((metric) => {
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