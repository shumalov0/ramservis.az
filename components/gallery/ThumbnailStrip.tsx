'use client';

import { useRef, useEffect, forwardRef, useCallback, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { handleArrowNavigation, announceToScreenReader, prefersReducedMotion } from '@/lib/accessibility-utils';

interface ThumbnailStripProps {
  images: string[];
  currentIndex: number;
  onThumbnailClick: (index: number) => void;
  layout?: 'horizontal' | 'vertical';
  carInfo: { brand: string; model: string; year: number };
}

export default function ThumbnailStrip({
  images,
  currentIndex,
  onThumbnailClick,
  layout = 'horizontal',
  carInfo
}: ThumbnailStripProps) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const activeThumbRef = useRef<HTMLButtonElement | null>(null);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);
  
  // Touch handling state
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const [isDragging, setIsDragging] = useState(false);

  // Keyboard navigation handler
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    const thumbnails = thumbnailRefs.current.filter(Boolean) as HTMLButtonElement[];
    handleArrowNavigation(
      event.nativeEvent,
      thumbnails,
      currentIndex,
      (newIndex) => {
        onThumbnailClick(newIndex);
        announceToScreenReader(`Selected image ${newIndex + 1} of ${images.length}`);
      },
      layout
    );
  }, [currentIndex, onThumbnailClick, images.length, layout]);

  // Auto-scroll to active thumbnail
  useEffect(() => {
    if (activeThumbRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const activeThumb = activeThumbRef.current;
      
      const containerRect = container.getBoundingClientRect();
      const thumbRect = activeThumb.getBoundingClientRect();
      
      if (layout === 'horizontal') {
        const scrollLeft = activeThumb.offsetLeft - container.offsetWidth / 2 + activeThumb.offsetWidth / 2;
        if (container.scrollTo) {
          container.scrollTo({
            left: scrollLeft,
            behavior: prefersReducedMotion() ? 'auto' : 'smooth'
          });
        } else {
          // Fallback for environments without scrollTo support (like JSDOM)
          container.scrollLeft = scrollLeft;
        }
      } else {
        const scrollTop = activeThumb.offsetTop - container.offsetHeight / 2 + activeThumb.offsetHeight / 2;
        if (container.scrollTo) {
          container.scrollTo({
            top: scrollTop,
            behavior: prefersReducedMotion() ? 'auto' : 'smooth'
          });
        } else {
          // Fallback for environments without scrollTo support (like JSDOM)
          container.scrollTop = scrollTop;
        }
      }
    }
  }, [currentIndex, layout]);

  if (images.length <= 1) {
    return null;
  }

  const containerClasses = cn(
    "flex gap-2 overflow-auto scrollbar-hide",
    layout === 'horizontal' 
      ? "flex-row pb-2" 
      : "flex-col max-h-96 pr-2"
  );

  const gridClasses = layout === 'horizontal' 
    ? "grid-flow-col auto-cols-max" 
    : "grid-flow-row auto-rows-max";

  return (
    <div 
      ref={scrollContainerRef}
      className={containerClasses}
      role="tablist"
      aria-label={`${carInfo.brand} ${carInfo.model} image thumbnails. ${images.length} images available.`}
      onKeyDown={handleKeyDown}
    >
      <div className={cn("grid gap-2", gridClasses)}>
        {images.map((image, index) => (
          <ThumbnailButton
            key={`${image}-${index}`}
            ref={(el) => {
              thumbnailRefs.current[index] = el;
              if (index === currentIndex) {
                activeThumbRef.current = el;
              }
            }}
            image={image}
            index={index}
            isActive={index === currentIndex}
            onClick={() => {
              onThumbnailClick(index);
              announceToScreenReader(`Selected image ${index + 1} of ${images.length}`);
            }}
            carInfo={carInfo}
            layout={layout}
            totalImages={images.length}
          />
        ))}
      </div>
    </div>
  );
}

interface ThumbnailButtonProps {
  image: string;
  index: number;
  isActive: boolean;
  onClick: () => void;
  carInfo: { brand: string; model: string; year: number };
  layout: 'horizontal' | 'vertical';
  totalImages: number;
}

const ThumbnailButton = forwardRef<HTMLButtonElement, ThumbnailButtonProps>(
  ({ image, index, isActive, onClick, carInfo, layout, totalImages }, ref) => {
    const aspectRatio = layout === 'horizontal' ? 'aspect-video' : 'aspect-square';
    const size = layout === 'horizontal' ? 'w-20 h-12' : 'w-16 h-16';

    return (
      <motion.button
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 touch-target",
          size,
          aspectRatio,
          isActive 
            ? "border-amber-500 ring-2 ring-amber-500/20" 
            : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
        )}
        onClick={onClick}
        whileHover={prefersReducedMotion() ? {} : { scale: 1.05 }}
        whileTap={prefersReducedMotion() ? {} : { scale: 0.95 }}
        role="tab"
        aria-selected={isActive}
        aria-label={`${isActive ? 'Currently selected: ' : ''}Image ${index + 1} of ${totalImages}: ${carInfo.brand} ${carInfo.model} ${carInfo.year}`}
        tabIndex={isActive ? 0 : -1}
        type="button"
      >
        <img
          src={image}
          alt=""
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-all duration-200",
            isActive ? "opacity-100" : "opacity-70 hover:opacity-90"
          )}
          loading="lazy"
          crossOrigin="anonymous"
        />
        
        {/* Active indicator */}
        {isActive && (
          <motion.div
            layoutId="thumbnail-indicator"
            className="absolute inset-0 bg-amber-500/10 border border-amber-500"
            initial={false}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}


      </motion.button>
    );
  }
);

ThumbnailButton.displayName = 'ThumbnailButton';