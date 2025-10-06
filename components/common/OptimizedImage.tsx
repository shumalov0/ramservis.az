'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { usePerformanceOptimization } from '@/hooks/use-performance-optimization';
import { performanceUtils } from '@/lib/performance-monitor';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
  fallbackSrc?: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  fill = false,
  sizes,
  quality = 85,
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  onError,
  fallbackSrc = '/cars/placeholder.jpg',
  ...props
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const loadStartTime = useRef<number>(0);
  
  const { optimizeImageSrc, trackInteraction } = usePerformanceOptimization();

  // Optimize image source with WebP support
  const optimizedSrc = optimizeImageSrc(imgSrc, width, quality);

  useEffect(() => {
    loadStartTime.current = performance.now();
  }, [imgSrc]);

  const handleLoad = () => {
    const loadTime = performance.now() - loadStartTime.current;
    
    // Track performance metrics
    trackInteraction('image-load-success', 'optimized-image', loadTime);
    performanceUtils.measureImageLoad(imgSrc).catch(() => {
      // Silent fail for performance tracking
    });
    
    onLoad?.();
  };

  const handleError = () => {
    const loadTime = performance.now() - loadStartTime.current;
    setHasError(true);
    
    // Track error metrics
    trackInteraction('image-load-error', 'optimized-image', loadTime);
    
    // Retry logic with exponential backoff
    if (retryCount < 2) {
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        setHasError(false);
        setImgSrc(src); // Reset to original source
      }, Math.pow(2, retryCount) * 1000);
    } else {
      setImgSrc(fallbackSrc);
    }
    
    onError?.();
  };

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <Image
        src={optimizedSrc}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        sizes={sizes}
        quality={quality}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          hasError && retryCount >= 2 && 'grayscale'
        )}
        {...props}
      />
      
      {hasError && retryCount >= 2 && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">Image unavailable</p>
            {retryCount > 0 && (
              <p className="text-xs text-gray-400 mt-1">
                Retried {retryCount} times
              </p>
            )}
          </div>
        </div>
      )}
      

    </div>
  );
}