'use client';

import { useState, useCallback, useEffect, useRef, memo } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ZoomIn, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { announceToScreenReader } from '@/lib/accessibility-utils';
import { getSafeImageSrc, FALLBACK_IMAGES, addCacheBuster, DEFAULT_FALLBACK_IMAGE } from '@/lib/image-utils';

interface MainImageViewerProps {
  images: string[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  onFullscreenOpen: () => void;
  carInfo: { brand: string; model: string; year: number };
}

function MainImageViewer({
  images,
  currentIndex,
  onIndexChange,
  onFullscreenOpen,
  carInfo
}: MainImageViewerProps) {
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [overrideSrc, setOverrideSrc] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  
  // Touch handling refs and state
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const wheelDelta = useRef(0);

  const handlePrevious = useCallback(() => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setHasError(false);
    setRetryCount(0);
    onIndexChange(newIndex);
    announceToScreenReader(`Image ${newIndex + 1} of ${images.length}`);
  }, [currentIndex, images.length, onIndexChange]);

  const handleNext = useCallback(() => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    setHasError(false);
    setRetryCount(0);
    onIndexChange(newIndex);
    announceToScreenReader(`Image ${newIndex + 1} of ${images.length}`);
  }, [currentIndex, images.length, onIndexChange]);

  // Reset state when currentIndex changes
  useEffect(() => {
    setHasError(false);
    setRetryCount(0);
    setOverrideSrc(null);
  }, [currentIndex, images]);

  // Preload next and previous images for instant switching
  useEffect(() => {
    if (images.length <= 1) return;
    
    const preloadImage = (index: number) => {
      if (index >= 0 && index < images.length) {
        const img = new window.Image();
        img.src = images[index];
      }
    };

    // Preload next image
    const nextIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    preloadImage(nextIndex);

    // Preload previous image
    const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    preloadImage(prevIndex);
  }, [currentIndex, images]);

  const toggleZoom = useCallback(() => {
    setIsZoomed(!isZoomed);
    announceToScreenReader(isZoomed ? 'Zoom disabled' : 'Zoom enabled');
  }, [isZoomed]);

  // Touch event handlers for swipe navigation
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
      setIsDragging(false);
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const deltaX = Math.abs(e.touches[0].clientX - touchStartX.current);
      const deltaY = Math.abs(e.touches[0].clientY - touchStartY.current);
      
      // If horizontal movement is greater than vertical, prevent scrolling
      if (deltaX > deltaY && deltaX > 10) {
        e.preventDefault();
        setIsDragging(true);
      }
    }
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (e.changedTouches.length === 1 && images.length > 1) {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaX = touchEndX - touchStartX.current;
      const deltaY = touchEndY - touchStartY.current;
      
      // Check if it's a horizontal swipe (more horizontal than vertical movement)
      const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
      const swipeThreshold = 50; // Minimum distance for a swipe
      
      if (isHorizontalSwipe && Math.abs(deltaX) > swipeThreshold) {
        if (deltaX > 0) {
          // Swipe right - go to previous image
          handlePrevious();
        } else {
          // Swipe left - go to next image
          handleNext();
        }
      } else if (!isDragging && Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
        // It's a tap, not a swipe - toggle zoom
        toggleZoom();
      }
    }
    setIsDragging(false);
  }, [handlePrevious, handleNext, toggleZoom, isDragging, images.length]);

  const handleWheel = useCallback((event: React.WheelEvent) => {
    if (images.length <= 1) {
      return;
    }

    wheelDelta.current += event.deltaY;
    const threshold = 80;

    if (Math.abs(wheelDelta.current) >= threshold) {
      event.preventDefault();
      if (wheelDelta.current > 0) {
        handleNext();
      } else {
        handlePrevious();
      }
      wheelDelta.current = 0;
    }
  }, [handleNext, handlePrevious, images.length]);

  // Enhanced keyboard navigation - only when component is focused
  const handleContainerKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      handlePrevious();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      handleNext();
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onFullscreenOpen();
    } else if (event.key === 'z' || event.key === 'Z') {
      event.preventDefault();
      toggleZoom();
    }
  }, [handlePrevious, handleNext, onFullscreenOpen, toggleZoom]);



  const handleImageLoad = () => {
    setHasError(false);
    setRetryCount(0);
  };

  const handleImageError = (event: any) => {
    const currentSrc = event.target.src;
    const currentFallbackIndex = FALLBACK_IMAGES.findIndex(img => 
      currentSrc.includes(img.split('/').pop()?.split('?')[0] || '')
    );
    
    // Try next fallback image
    if (currentFallbackIndex < FALLBACK_IMAGES.length - 1) {
      const nextFallback = FALLBACK_IMAGES[currentFallbackIndex + 1];
      setOverrideSrc(nextFallback);
      return;
    }
    
    // All fallbacks failed, try retry with original image
    if (retryCount < 2 && !currentSrc.includes('placeholder') && !currentSrc.includes('data:image')) {
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        setHasError(false);
        setOverrideSrc(addCacheBuster(images[currentIndex]));
      }, Math.pow(2, retryCount) * 1000);
      return;
    }
    
    // Everything failed
    setHasError(true);
    setOverrideSrc(DEFAULT_FALLBACK_IMAGE);
  };



  if (images.length === 0) {
    return (
      <div className="relative aspect-video bg-gray-200 dark:bg-slate-700 rounded-2xl flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">No images available</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onKeyDown={handleContainerKeyDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
      onClick={(e) => {
        // Only zoom if clicking on the main area, not on buttons, and not after a drag
        if (!isDragging && (e.target === e.currentTarget || (e.target as HTMLElement).tagName === 'IMG')) {
          toggleZoom();
        }
      }}
      tabIndex={0}
      role="img"
      aria-label={`${carInfo.brand} ${carInfo.model} ${carInfo.year} image gallery. Currently showing image ${currentIndex + 1} of ${images.length}. Click to zoom, use arrow keys to navigate, Enter for fullscreen, or swipe left/right to navigate.`}
      className="relative aspect-video overflow-hidden rounded-2xl shadow-2xl bg-gray-100 dark:bg-slate-700 group cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 touch-pan-y"
    >
      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-2">📷</div>
          <p className="text-sm">Image failed to load</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2"
            onClick={(e) => {
              e.stopPropagation();
              setHasError(false);
              setRetryCount(0);
              setOverrideSrc(addCacheBuster(images[currentIndex]));
            }}
          >
            Retry ({retryCount}/2)
          </Button>
        </div>
      ) : (
        <Image
          src={getSafeImageSrc(overrideSrc ?? images[currentIndex] ?? DEFAULT_FALLBACK_IMAGE)}
          alt={`${carInfo.brand} ${carInfo.model} ${carInfo.year} - Image ${currentIndex + 1} of ${images.length}. ${isZoomed ? 'Zoomed view.' : 'Click to zoom or open fullscreen.'}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
          className={`object-cover transition-transform duration-300 cursor-pointer ${isZoomed ? 'scale-110' : 'scale-100'}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          onClick={(e) => {
            e.stopPropagation();
            toggleZoom();
          }}
          priority={currentIndex === 0}
          quality={80}
        />
      )}

      {/* Navigation Controls */}
      {images.length > 1 && (
        <>
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800 shadow-lg opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-200 min-w-[44px] min-h-[44px] touch-target"
            onClick={(e) => {
              e.stopPropagation();
              handlePrevious();
            }}
            aria-label={`Previous image. Currently showing ${currentIndex + 1} of ${images.length}`}
            type="button"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </Button>

          <Button
            variant="secondary"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800 shadow-lg opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-200 min-w-[44px] min-h-[44px] touch-target"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            aria-label={`Next image. Currently showing ${currentIndex + 1} of ${images.length}`}
            type="button"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </Button>
        </>
      )}

      {/* Action Buttons */}
      <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Button
          variant="secondary"
          size="icon"
          className="bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800 shadow-lg min-w-[44px] min-h-[44px] touch-target"
          onClick={(e) => {
            e.stopPropagation();
            toggleZoom();
          }}
          aria-label={isZoomed ? "Zoom out" : "Zoom in"}
          aria-pressed={isZoomed}
          type="button"
        >
          <ZoomIn className="h-4 w-4" aria-hidden="true" />
        </Button>

        <Button
          variant="secondary"
          size="icon"
          className="bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800 shadow-lg min-w-[44px] min-h-[44px] touch-target"
          onClick={(e) => {
            e.stopPropagation();
            onFullscreenOpen();
          }}
          aria-label="Open fullscreen gallery view"
          type="button"
        >
          <Maximize2 className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>

      {/* Image Counter */}
      {images.length > 1 && (
        <div 
          className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium"
          aria-live="polite"
          aria-label={`Image ${currentIndex + 1} of ${images.length}`}
        >
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Screen reader instructions */}
      <div className="sr-only">
        Use arrow keys to navigate between images, Enter or Space to open fullscreen, Z to toggle zoom. 
        Swipe left or right on touch devices to navigate between images. Tap to zoom in/out.
      </div>
      
      {/* Touch indicator for mobile users */}
      {images.length > 1 && (
        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 md:hidden">
          Swipe ←→
        </div>
      )}
    </div>
  );
}

export default memo(MainImageViewer);
