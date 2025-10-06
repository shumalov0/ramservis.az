'use client';

import React, { useEffect, useCallback, useRef } from 'react';
import { usePerformanceMonitor } from '@/lib/performance-monitor';

interface PerformanceOptimizationOptions {
  enableImageOptimization?: boolean;
  enableLazyLoading?: boolean;
  enablePreloading?: boolean;
  trackUserInteractions?: boolean;
  debounceMs?: number;
}

export function usePerformanceOptimization(options: PerformanceOptimizationOptions = {}) {
  const {
    enableImageOptimization = true,
    enableLazyLoading = true,
    enablePreloading = true,
    trackUserInteractions = true,
    debounceMs = 300
  } = options;

  const monitor = usePerformanceMonitor();
  const intersectionObserver = useRef<IntersectionObserver | null>(null);
  const preloadedResources = useRef<Set<string>>(new Set());

  // Initialize Intersection Observer for lazy loading
  useEffect(() => {
    if (!enableLazyLoading || typeof window === 'undefined') return;

    intersectionObserver.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            
            // Handle lazy image loading
            if (element.dataset.src && element.tagName === 'IMG') {
              const img = element as HTMLImageElement;
              img.src = element.dataset.src;
              img.removeAttribute('data-src');
              monitor.trackUserInteraction('lazy-load', 'image');
            }
            
            // Handle lazy component loading
            if (element.dataset.component) {
              monitor.trackUserInteraction('lazy-load', element.dataset.component);
            }
            
            intersectionObserver.current?.unobserve(element);
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    return () => {
      intersectionObserver.current?.disconnect();
    };
  }, [enableLazyLoading, monitor]);

  // Preload critical resources
  const preloadResource = useCallback((href: string, as: string = 'fetch') => {
    if (!enablePreloading || preloadedResources.current.has(href)) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    
    if (as === 'image') {
      link.type = 'image/webp';
    }
    
    document.head.appendChild(link);
    preloadedResources.current.add(href);
    
    monitor.trackUserInteraction('preload', as, 1);
  }, [enablePreloading, monitor]);

  // Optimize images with WebP support
  const optimizeImageSrc = useCallback((src: string, width?: number, quality: number = 85) => {
    if (!enableImageOptimization) return src;

    // Check if browser supports WebP
    const supportsWebP = typeof window !== 'undefined' && 
      document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0;

    if (supportsWebP && !src.includes('.webp')) {
      const url = new URL(src, window.location.origin);
      url.searchParams.set('format', 'webp');
      url.searchParams.set('quality', quality.toString());
      if (width) {
        url.searchParams.set('width', width.toString());
      }
      return url.toString();
    }

    return src;
  }, [enableImageOptimization]);

  // Debounced function for performance-sensitive operations
  const debounce = useCallback(<T extends (...args: any[]) => any>(
    func: T,
    delay: number = debounceMs
  ): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }, [debounceMs]);

  // Track user interactions with debouncing
  const trackInteraction = useCallback(
    debounce((action: string, element: string, value?: number) => {
      if (trackUserInteractions) {
        monitor.trackUserInteraction(action, element, value);
      }
    }),
    [monitor, trackUserInteractions, debounce]
  );

  // Observe element for lazy loading
  const observeElement = useCallback((element: HTMLElement) => {
    if (intersectionObserver.current && element) {
      intersectionObserver.current.observe(element);
    }
  }, []);

  // Measure component performance
  const measureComponent = useCallback((componentName: string) => {
    const startTime = performance.now();
    
    return () => {
      const renderTime = performance.now() - startTime;
      monitor.recordMetric(`${componentName}-render`, renderTime);
    };
  }, [monitor]);

  // Prefetch route on hover
  const prefetchRoute = useCallback((href: string) => {
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = href;
        document.head.appendChild(link);
        
        monitor.trackUserInteraction('prefetch', 'route');
      });
    }
  }, [monitor]);

  // Critical resource hints
  const addResourceHints = useCallback((resources: Array<{ href: string; rel: string; as?: string }>) => {
    resources.forEach(({ href, rel, as }) => {
      const link = document.createElement('link');
      link.rel = rel;
      link.href = href;
      if (as) link.as = as;
      document.head.appendChild(link);
    });
  }, []);

  // Memory usage monitoring
  const checkMemoryUsage = useCallback(() => {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory;
      const usage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
      
      if (usage > 80) {
        console.warn('High memory usage detected:', usage.toFixed(2) + '%');
        monitor.recordMetric('memory-usage-high', usage);
      }
      
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
        percentage: usage
      };
    }
    return null;
  }, [monitor]);

  // Cleanup function
  const cleanup = useCallback(() => {
    intersectionObserver.current?.disconnect();
    preloadedResources.current.clear();
  }, []);

  return {
    // Core functions
    preloadResource,
    optimizeImageSrc,
    trackInteraction,
    observeElement,
    measureComponent,
    prefetchRoute,
    addResourceHints,
    checkMemoryUsage,
    cleanup,
    
    // Utilities
    debounce,
    
    // State
    isOptimizationEnabled: {
      images: enableImageOptimization,
      lazyLoading: enableLazyLoading,
      preloading: enablePreloading,
      tracking: trackUserInteractions
    }
  };
}

// Higher-order component for automatic performance optimization
export function withPerformanceOptimization<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string,
  options?: PerformanceOptimizationOptions
) {
  return function OptimizedComponent(props: P) {
    const { measureComponent, trackInteraction } = usePerformanceOptimization(options);
    
    useEffect(() => {
      const endMeasurement = measureComponent(componentName);
      
      // Track component mount
      trackInteraction('mount', componentName);
      
      return () => {
        endMeasurement();
        trackInteraction('unmount', componentName);
      };
    }, [measureComponent, trackInteraction]);

    return React.createElement(Component as React.ComponentType<P>, props as P);
  };
}