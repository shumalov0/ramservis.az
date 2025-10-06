'use client';

import { useEffect, useState, useCallback } from 'react';

interface PerformanceMetrics {
  deviceMemory?: number;
  hardwareConcurrency: number;
  connectionType?: string;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
  isLowEndDevice: boolean;
  performanceLevel: 'low' | 'medium' | 'high';
}

export function usePerformance() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    hardwareConcurrency: navigator.hardwareConcurrency || 4,
    isLowEndDevice: false,
    performanceLevel: 'medium'
  });

  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);

    // Gather performance metrics
    const gatherMetrics = () => {
      const nav = navigator as any;
      let score = 0;

      // Device memory (if available)
      const deviceMemory = nav.deviceMemory;
      if (deviceMemory) {
        if (deviceMemory >= 8) score += 3;
        else if (deviceMemory >= 4) score += 2;
        else if (deviceMemory >= 2) score += 1;
      }

      // CPU cores
      const cores = navigator.hardwareConcurrency || 4;
      if (cores >= 8) score += 2;
      else if (cores >= 4) score += 1;

      // Network information
      const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
      let connectionInfo = {};
      
      if (connection) {
        connectionInfo = {
          connectionType: connection.type,
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData
        };

        // Network quality scoring
        if (connection.effectiveType === '4g' || connection.downlink > 10) {
          score += 2;
        } else if (connection.effectiveType === '3g' || connection.downlink > 1) {
          score += 1;
        }

        // Penalize if save-data is enabled
        if (connection.saveData) {
          score -= 1;
        }
      }

      // Check if mobile device (generally lower performance)
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (isMobile) {
        score = Math.max(0, score - 2);
      }

      // Determine performance level
      let performanceLevel: 'low' | 'medium' | 'high' = 'medium';
      if (score >= 6) {
        performanceLevel = 'high';
      } else if (score <= 2) {
        performanceLevel = 'low';
      }

      // Check for low-end device indicators
      const isLowEndDevice = score <= 2 || deviceMemory <= 2 || cores <= 2;

      setMetrics({
        deviceMemory,
        hardwareConcurrency: cores,
        ...connectionInfo,
        isLowEndDevice,
        performanceLevel
      });
    };

    gatherMetrics();

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const shouldReduceAnimations = useCallback(() => {
    return isReducedMotion || metrics.isLowEndDevice || metrics.performanceLevel === 'low';
  }, [isReducedMotion, metrics.isLowEndDevice, metrics.performanceLevel]);

  const shouldLazyLoad = useCallback(() => {
    return metrics.performanceLevel === 'low' || metrics.saveData;
  }, [metrics.performanceLevel, metrics.saveData]);

  const getOptimalImageQuality = useCallback(() => {
    if (metrics.performanceLevel === 'high' && !metrics.saveData) {
      return 90;
    } else if (metrics.performanceLevel === 'medium') {
      return 80;
    } else {
      return 70;
    }
  }, [metrics.performanceLevel, metrics.saveData]);

  const getOptimalChunkSize = useCallback(() => {
    if (metrics.performanceLevel === 'high') {
      return 50; // Load more items at once
    } else if (metrics.performanceLevel === 'medium') {
      return 20;
    } else {
      return 10; // Load fewer items for low-end devices
    }
  }, [metrics.performanceLevel]);

  return {
    metrics,
    isReducedMotion,
    shouldReduceAnimations,
    shouldLazyLoad,
    getOptimalImageQuality,
    getOptimalChunkSize
  };
}