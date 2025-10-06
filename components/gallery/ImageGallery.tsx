'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import MainImageViewer from './MainImageViewer';
import ThumbnailStrip from './ThumbnailStrip';
import FullscreenLightbox from './FullscreenLightbox';

interface ImageGalleryProps {
  images: string[];
  carInfo: { brand: string; model: string; year: number };
  className?: string;
  thumbnailLayout?: 'horizontal' | 'vertical';
  enableLazyLoading?: boolean;
}

export default function ImageGallery({
  images,
  carInfo,
  className = '',
  thumbnailLayout = 'horizontal',
  enableLazyLoading = true
}: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  // Memoize processed images to avoid unnecessary re-renders
  const processedImages = useMemo(() => {
    if (!images || images.length === 0) {
      return [];
    }
    
    // Remove duplicates and filter out invalid URLs
    const uniqueImages = Array.from(new Set(images)).filter(img => 
      img && typeof img === 'string' && img.trim().length > 0
    );
    
    return uniqueImages;
  }, [images]);

  const handleIndexChange = useCallback((newIndex: number) => {
    if (newIndex >= 0 && newIndex < processedImages.length) {
      setCurrentIndex(newIndex);
    }
  }, [processedImages.length]);

  const handleFullscreenOpen = useCallback(() => {
    setIsFullscreenOpen(true);
  }, []);

  const handleFullscreenClose = useCallback(() => {
    setIsFullscreenOpen(false);
  }, []);

  const handleThumbnailClick = useCallback((index: number) => {
    handleIndexChange(index);
  }, [handleIndexChange]);

  // Handle empty or invalid image arrays
  if (!processedImages || processedImages.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="relative aspect-video bg-gray-200 dark:bg-slate-700 rounded-2xl flex items-center justify-center">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <div className="text-4xl mb-2">📷</div>
            <p className="text-sm">No images available</p>
            <p className="text-xs mt-1">
              {carInfo.brand} {carInfo.model} {carInfo.year}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className={`space-y-4 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Main Image Viewer */}
      <MainImageViewer
        images={processedImages}
        currentIndex={currentIndex}
        onIndexChange={handleIndexChange}
        onFullscreenOpen={handleFullscreenOpen}
        carInfo={carInfo}
      />

      {/* Thumbnail Strip */}
      <ThumbnailStrip
        images={processedImages}
        currentIndex={currentIndex}
        onThumbnailClick={handleThumbnailClick}
        layout={thumbnailLayout}
        carInfo={carInfo}
      />

      {/* Fullscreen Lightbox */}
      <FullscreenLightbox
        images={processedImages}
        isOpen={isFullscreenOpen}
        initialIndex={currentIndex}
        onClose={handleFullscreenClose}
        onIndexChange={handleIndexChange}
        carInfo={carInfo}
      />
    </motion.div>
  );
}