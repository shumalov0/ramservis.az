'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
// Removed animation imports for better performance
import { announceToScreenReader, trapFocus, prefersReducedMotion } from '@/lib/accessibility-utils';

interface FullscreenLightboxProps {
  images: string[];
  isOpen: boolean;
  initialIndex: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  carInfo: { brand: string; model: string; year: number };
}

export default function FullscreenLightbox({
  images,
  isOpen,
  initialIndex,
  onClose,
  onIndexChange,
  carInfo
}: FullscreenLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Sync with external index changes
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isOpen) return;

    switch (event.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowLeft':
        handlePrevious();
        break;
      case 'ArrowRight':
        handleNext();
        break;
      case '+':
      case '=':
        handleZoomIn();
        break;
      case '-':
        handleZoomOut();
        break;
      case '0':
        resetZoom();
        break;
      case 'r':
      case 'R':
        handleRotate();
        break;
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      
      // Focus management
      if (lightboxRef.current) {
        const cleanup = trapFocus(lightboxRef.current);
        closeButtonRef.current?.focus();
        
        announceToScreenReader(`Fullscreen gallery opened. Image ${currentIndex + 1} of ${images.length}. Use arrow keys to navigate, plus and minus to zoom, R to rotate, Escape to close.`);
        
        return () => {
          cleanup();
          document.removeEventListener('keydown', handleKeyDown);
          document.body.style.overflow = 'unset';
        };
      }
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown, currentIndex, images.length]);

  const handlePrevious = useCallback(() => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    onIndexChange(newIndex);
    resetZoom();
    announceToScreenReader(`Image ${newIndex + 1} of ${images.length}`);
  }, [currentIndex, images.length, onIndexChange]);

  const handleNext = useCallback(() => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    onIndexChange(newIndex);
    resetZoom();
    announceToScreenReader(`Image ${newIndex + 1} of ${images.length}`);
  }, [currentIndex, images.length, onIndexChange]);

  const handleZoomIn = () => {
    const newLevel = Math.min(zoomLevel + 0.5, 3);
    setZoomLevel(newLevel);
    setIsZoomed(true);
    announceToScreenReader(`Zoomed to ${Math.round(newLevel * 100)}%`);
  };

  const handleZoomOut = () => {
    const newLevel = Math.max(zoomLevel - 0.5, 1);
    setZoomLevel(newLevel);
    if (newLevel === 1) setIsZoomed(false);
    announceToScreenReader(`Zoomed to ${Math.round(newLevel * 100)}%`);
  };

  const resetZoom = () => {
    setZoomLevel(1);
    setIsZoomed(false);
    setRotation(0);
    announceToScreenReader('Image reset to original size and rotation');
  };

  const handleRotate = () => {
    const newRotation = (rotation + 90) % 360;
    setRotation(newRotation);
    announceToScreenReader(`Image rotated to ${newRotation} degrees`);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isLeftSwipe = distanceX > 50;
    const isRightSwipe = distanceX < -50;
    const isUpSwipe = distanceY > 50;
    const isDownSwipe = distanceY < -50;

    // Only handle horizontal swipes for navigation
    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      if (isLeftSwipe) {
        handleNext();
      } else if (isRightSwipe) {
        handlePrevious();
      }
    } else if (isUpSwipe || isDownSwipe) {
      // Vertical swipe to close
      onClose();
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(images[currentIndex]);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${carInfo.brand}-${carInfo.model}-${currentIndex + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download image:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
        <motion.div
          ref={lightboxRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion() ? 0.01 : 0.3 }}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`Fullscreen gallery: ${carInfo.brand} ${carInfo.model} ${carInfo.year}. Image ${currentIndex + 1} of ${images.length}`}
        >
        {/* Header Controls */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
          <div className="text-white">
            <h3 className="text-lg font-semibold">
              {carInfo.brand} {carInfo.model} {carInfo.year}
            </h3>
            <p className="text-sm text-gray-300">
              Image {currentIndex + 1} of {images.length}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 min-w-[44px] min-h-[44px] touch-target"
              onClick={(e) => {
                e.stopPropagation();
                handleDownload();
              }}
              aria-label={`Download image ${currentIndex + 1} of ${carInfo.brand} ${carInfo.model}`}
              type="button"
            >
              <Download className="h-5 w-5" aria-hidden="true" />
            </Button>

            <Button
              ref={closeButtonRef}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 min-w-[44px] min-h-[44px] touch-target"
              onClick={onClose}
              aria-label="Close fullscreen gallery"
              type="button"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </Button>
          </div>
        </div>

        {/* Main Image Container */}
        <div className="flex items-center justify-center h-full p-4 pt-20 pb-20">
          <div 
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ 
                opacity: 1, 
                scale: zoomLevel,
                rotate: rotation
              }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={cn(
                "relative max-w-full max-h-full",
                isZoomed && "cursor-move"
              )}
              style={{
                transform: `scale(${zoomLevel}) rotate(${rotation}deg)`
              }}
            >
              <img
                src={images[currentIndex]}
                alt={`${carInfo.brand} ${carInfo.model} ${carInfo.year} - Image ${currentIndex + 1} of ${images.length}. Zoom level: ${Math.round(zoomLevel * 100)}%. Rotation: ${rotation} degrees.`}
                className="max-w-full max-h-full object-contain"
                onLoadStart={() => setIsLoading(true)}
                onLoad={() => setIsLoading(false)}
                onError={() => setIsLoading(false)}
                crossOrigin="anonymous"
              />

              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-white border-t-transparent rounded-full"
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          </div>
        </div>

        {/* Navigation Controls */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 w-12 h-12 min-w-[48px] min-h-[48px] touch-target"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
              }}
              aria-label={`Previous image. Currently showing ${currentIndex + 1} of ${images.length}`}
              type="button"
            >
              <ChevronLeft className="h-8 w-8" aria-hidden="true" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 w-12 h-12 min-w-[48px] min-h-[48px] touch-target"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label={`Next image. Currently showing ${currentIndex + 1} of ${images.length}`}
              type="button"
            >
              <ChevronRight className="h-8 w-8" aria-hidden="true" />
            </Button>
          </>
        )}

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-center p-4 bg-gradient-to-t from-black/50 to-transparent">
          <div className="flex items-center space-x-2 bg-black/30 rounded-full px-4 py-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 w-10 h-10 min-w-[44px] min-h-[44px] touch-target"
              onClick={(e) => {
                e.stopPropagation();
                handleZoomOut();
              }}
              disabled={zoomLevel <= 1}
              aria-label={`Zoom out. Current zoom: ${Math.round(zoomLevel * 100)}%`}
              type="button"
            >
              <ZoomOut className="h-4 w-4" aria-hidden="true" />
            </Button>

            <span 
              className="text-white text-sm min-w-[3rem] text-center"
              aria-live="polite"
              aria-label={`Current zoom level: ${Math.round(zoomLevel * 100)} percent`}
            >
              {Math.round(zoomLevel * 100)}%
            </span>

            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 w-10 h-10 min-w-[44px] min-h-[44px] touch-target"
              onClick={(e) => {
                e.stopPropagation();
                handleZoomIn();
              }}
              disabled={zoomLevel >= 3}
              aria-label={`Zoom in. Current zoom: ${Math.round(zoomLevel * 100)}%`}
              type="button"
            >
              <ZoomIn className="h-4 w-4" aria-hidden="true" />
            </Button>

            <div className="w-px h-6 bg-white/30 mx-2" role="separator" />

            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 w-10 h-10 min-w-[44px] min-h-[44px] touch-target"
              onClick={(e) => {
                e.stopPropagation();
                handleRotate();
              }}
              aria-label={`Rotate image 90 degrees. Current rotation: ${rotation} degrees`}
              type="button"
            >
              <RotateCw className="h-4 w-4" aria-hidden="true" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 min-h-[44px] touch-target px-4"
              onClick={(e) => {
                e.stopPropagation();
                resetZoom();
              }}
              aria-label="Reset image to original size and rotation"
              type="button"
            >
              Reset
            </Button>
          </div>
        </div>

        {/* Keyboard shortcuts hint */}
        <div className="absolute bottom-4 left-4 text-white/60 text-xs space-y-1 hidden md:block" aria-hidden="true">
          <p>← → Navigate</p>
          <p>+ - Zoom</p>
          <p>R Rotate</p>
          <p>ESC Close</p>
        </div>

        {/* Screen reader instructions */}
        <div className="sr-only">
          Fullscreen image gallery. Use arrow keys to navigate between images, 
          plus and minus keys to zoom in and out, R key to rotate image, 
          0 key to reset zoom and rotation, Escape key to close gallery.
          Swipe left or right on touch devices to navigate, swipe up or down to close.
        </div>
        </motion.div>
    </AnimatePresence>
  );
}