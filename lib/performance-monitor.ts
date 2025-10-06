'use client';

import React from 'react';

/**
 * Performance monitoring utilities
 */

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private observers: PerformanceObserver[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeObservers();
    }
  }

  private initializeObservers() {
    // Observe Core Web Vitals
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.recordMetric('LCP', lastEntry.startTime);
      });
      
      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (e) {
        console.warn('LCP observer not supported');
      }

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.recordMetric('FID', entry.processingStart - entry.startTime);
        });
      });
      
      try {
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);
      } catch (e) {
        console.warn('FID observer not supported');
      }

      // Cumulative Layout Shift (CLS)
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        this.recordMetric('CLS', clsValue);
      });
      
      try {
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      } catch (e) {
        console.warn('CLS observer not supported');
      }
    }
  }

  recordMetric(name: string, value: number, tags?: Record<string, string>) {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now()
    };
    
    this.metrics.push(metric);
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance Metric - ${name}: ${value.toFixed(2)}ms`, tags);
    }

    // Send to analytics services
    this.sendToAnalytics(name, value, tags);
  }

  private sendToAnalytics(name: string, value: number, tags?: Record<string, string>) {
    // Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'performance_metric', {
        metric_name: name,
        metric_value: Math.round(value),
        custom_parameters: tags,
      });
    }

    // Custom analytics endpoint (fire and forget)
    if (typeof window !== 'undefined') {
      fetch('/api/analytics/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metric: name,
          value: value,
          timestamp: Date.now(),
          url: window.location.pathname,
          userAgent: navigator.userAgent,
          tags
        })
      }).catch(() => {
        // Silently fail for analytics
      });
    }
  }

  trackUserInteraction(action: string, element: string, value?: number) {
    this.recordMetric(`interaction-${action}`, value || 1, { element });
  }

  trackError(error: Error, context?: string) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: error.message,
        fatal: false,
        context
      });
    }

    this.recordMetric('error-count', 1, { 
      error: error.name,
      context: context || 'unknown'
    });
  }

  // Measure component render time
  measureRender<T>(componentName: string, renderFn: () => T): T {
    const startTime = performance.now();
    const result = renderFn();
    const endTime = performance.now();
    
    this.recordMetric(`${componentName}_render`, endTime - startTime);
    return result;
  }

  // Measure async operation time
  async measureAsync<T>(operationName: string, asyncFn: () => Promise<T>): Promise<T> {
    const startTime = performance.now();
    try {
      const result = await asyncFn();
      const endTime = performance.now();
      this.recordMetric(`${operationName}_async`, endTime - startTime);
      return result;
    } catch (error) {
      const endTime = performance.now();
      this.recordMetric(`${operationName}_error`, endTime - startTime);
      throw error;
    }
  }

  // Get navigation timing metrics
  getNavigationMetrics() {
    if (typeof window === 'undefined' || !window.performance) {
      return null;
    }

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (!navigation) return null;

    return {
      dns: navigation.domainLookupEnd - navigation.domainLookupStart,
      tcp: navigation.connectEnd - navigation.connectStart,
      ssl: navigation.secureConnectionStart > 0 
        ? navigation.connectEnd - navigation.secureConnectionStart 
        : 0,
      ttfb: navigation.responseStart - navigation.requestStart,
      download: navigation.responseEnd - navigation.responseStart,
      domParse: navigation.domContentLoadedEventStart - navigation.responseEnd,
      domReady: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      total: navigation.loadEventEnd - navigation.fetchStart
    };
  }

  // Get resource timing metrics
  getResourceMetrics() {
    if (typeof window === 'undefined' || !window.performance) {
      return [];
    }

    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    return resources.map(resource => ({
      name: resource.name,
      type: this.getResourceType(resource.name),
      size: resource.transferSize || 0,
      duration: resource.responseEnd - resource.startTime,
      cached: resource.transferSize === 0 && resource.decodedBodySize > 0
    }));
  }

  private getResourceType(url: string): string {
    if (url.includes('.js')) return 'script';
    if (url.includes('.css')) return 'stylesheet';
    if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) return 'image';
    if (url.includes('.woff') || url.includes('.ttf')) return 'font';
    return 'other';
  }

  // Get memory usage (if available)
  getMemoryUsage() {
    if (typeof window === 'undefined') return null;
    
    const memory = (performance as any).memory;
    if (!memory) return null;

    return {
      used: memory.usedJSHeapSize,
      total: memory.totalJSHeapSize,
      limit: memory.jsHeapSizeLimit,
      percentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
    };
  }

  // Get all recorded metrics
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  // Clear all metrics
  clearMetrics() {
    this.metrics = [];
  }

  // Generate performance report
  generateReport() {
    const navigation = this.getNavigationMetrics();
    const resources = this.getResourceMetrics();
    const memory = this.getMemoryUsage();
    const customMetrics = this.getMetrics();

    return {
      timestamp: new Date().toISOString(),
      navigation,
      resources: {
        total: resources.length,
        totalSize: resources.reduce((sum, r) => sum + r.size, 0),
        cached: resources.filter(r => r.cached).length,
        byType: resources.reduce((acc, r) => {
          acc[r.type] = (acc[r.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      },
      memory,
      customMetrics: customMetrics.reduce((acc, metric) => {
        if (!acc[metric.name]) acc[metric.name] = [];
        acc[metric.name].push({
          value: metric.value,
          timestamp: metric.timestamp
        });
        return acc;
      }, {} as Record<string, Array<{ value: number; timestamp: number }>>)
    };
  }

  // Cleanup observers
  disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// React hook for performance monitoring
export function usePerformanceMonitor() {
  return {
    recordMetric: performanceMonitor.recordMetric.bind(performanceMonitor),
    measureRender: performanceMonitor.measureRender.bind(performanceMonitor),
    measureAsync: performanceMonitor.measureAsync.bind(performanceMonitor),
    trackUserInteraction: performanceMonitor.trackUserInteraction.bind(performanceMonitor),
    trackError: performanceMonitor.trackError.bind(performanceMonitor),
    getReport: performanceMonitor.generateReport.bind(performanceMonitor),
    clearMetrics: performanceMonitor.clearMetrics.bind(performanceMonitor)
  };
}

// Higher-order component for automatic performance tracking
export function withPerformanceTracking<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) {
  return function PerformanceTrackedComponent(props: P) {
    const monitor = usePerformanceMonitor();
    
    React.useEffect(() => {
      const startTime = performance.now();
      return () => {
        const mountTime = performance.now() - startTime;
        monitor.recordMetric(`${componentName}-mount`, mountTime);
      };
    }, [monitor]);

    return React.createElement(Component as React.ComponentType<P>, props as P);
  };
}

// Utility functions for common performance measurements
export const performanceUtils = {
  measureImageLoad: (src: string) => {
    const img = new Image();
    const startTime = performance.now();
    
    return new Promise<number>((resolve, reject) => {
      img.onload = () => {
        const loadTime = performance.now() - startTime;
        performanceMonitor.recordMetric('image-load-time', loadTime, { src });
        resolve(loadTime);
      };
      
      img.onerror = () => {
        performanceMonitor.trackError(new Error(`Failed to load image: ${src}`), 'image-load');
        reject(new Error('Image load failed'));
      };
      
      img.src = src;
    });
  },

  measureApiCall: async <T>(
    apiCall: () => Promise<T>,
    endpoint: string
  ): Promise<T> => {
    return performanceMonitor.measureAsync(`api-${endpoint}`, apiCall);
  },

  measureComponentRender: (componentName: string) => {
    const startTime = performance.now();
    
    return () => {
      const renderTime = performance.now() - startTime;
      performanceMonitor.recordMetric(`${componentName}-render`, renderTime);
    };
  }
};