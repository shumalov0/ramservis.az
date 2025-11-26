'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { Navigation, Thumbs, Pagination, Keyboard } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import { cn } from '@/lib/utils';
import { FALLBACK_IMAGES } from '@/lib/image-utils';

interface ImageGalleryProps {
  images: string[];
  carInfo: { brand: string; model: string; year: number };
  className?: string;
  thumbnailLayout?: 'horizontal' | 'vertical';
}

export default function ImageGallery({
  images,
  carInfo,
  className = '',
  thumbnailLayout = 'horizontal',
}: ImageGalleryProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [loadedSlides, setLoadedSlides] = useState(0);
  const [isGalleryReady, setIsGalleryReady] = useState(false);
  const prevButtonRef = useRef<HTMLButtonElement | null>(null);
  const nextButtonRef = useRef<HTMLButtonElement | null>(null);
  const [isDesktop, setIsDesktop] = useState(true);
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const [zoomIndex, setZoomIndex] = useState<number | null>(null);

  const processedImages = useMemo(() => {
    if (!images || images.length === 0) {
      return FALLBACK_IMAGES;
    }

    return Array.from(new Set(images)).filter(
      (img) => img && typeof img === 'string' && img.trim().length > 0
    );
  }, [images]);

  useEffect(() => {
    setLoadedSlides(0);
    setIsGalleryReady(false);
  }, [processedImages]);

  useEffect(() => {
    if (processedImages.length === 0) return;
    if (loadedSlides > 0) {
      setIsGalleryReady(true);
    }
  }, [loadedSlides, processedImages.length]);

  if (!processedImages.length) {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="relative aspect-video bg-gray-200 dark:bg-slate-700 rounded-2xl flex items-center justify-center">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <div className="text-4xl mb-2">📷</div>
            <p className="text-sm">Şəkil əlavə edilməyib</p>
            <p className="text-xs mt-1">
              {carInfo.brand} {carInfo.model} {carInfo.year}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const showThumbnails = processedImages.length > 1;

  return (
    <div className={cn('space-y-4', className)}>
      <div className="relative">
        {!isGalleryReady && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl bg-gray-100/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-300 border-t-brand-gold" />
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">Şəkillər yüklənir...</p>
          </div>
        )}

        <Swiper
          modules={[Navigation, Thumbs, Pagination, Keyboard]}
          thumbs={showThumbnails ? { swiper: thumbsSwiper } : undefined}
          navigation={
            isDesktop && processedImages.length > 1
              ? {
                  prevEl: prevButtonRef.current,
                  nextEl: nextButtonRef.current,
                }
              : undefined
          }
          onBeforeInit={(swiper) => {
            if (isDesktop && typeof swiper.params.navigation !== 'boolean') {
              swiper.params.navigation!.prevEl = prevButtonRef.current;
              swiper.params.navigation!.nextEl = nextButtonRef.current;
            }
          }}
          pagination={{ clickable: true }}
          keyboard={{ enabled: true }}
          loop={processedImages.length > 1}
          className={cn(
            'group rounded-2xl overflow-hidden transition-opacity duration-300',
            !isGalleryReady && 'opacity-0'
          )}
        >
          {processedImages.map((src, index) => (
            <SwiperSlide key={`${src}-${index}`}>
              <div className="relative aspect-video">
                <Image
                  src={src}
                  alt={`${carInfo.brand} ${carInfo.model} ${carInfo.year} şəkil ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                  className="object-cover"
                  priority={index === 0}
                  quality={80}
                  onLoad={() => setLoadedSlides((count) => count + 1)}
                  onClick={() => setZoomIndex(index)}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {processedImages.length > 1 && isDesktop && (
          <>
            <button
              ref={prevButtonRef}
              type="button"
              className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-gray-800 shadow-lg transition hover:scale-105 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold dark:bg-black/70 dark:text-white md:h-12 md:w-12"
              aria-label="Əvvəlki şəkil"
            >
              <span className="text-lg md:text-xl">‹</span>
            </button>
            <button
              ref={nextButtonRef}
              type="button"
              className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-gray-800 shadow-lg transition hover:scale-105 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold dark:bg-black/70 dark:text-white md:h-12 md:w-12"
              aria-label="Növbəti şəkil"
            >
              <span className="text-lg md:text-xl">›</span>
            </button>
          </>
        )}
      </div>

      {showThumbnails && (
        <Swiper
          modules={[Thumbs]}
          onSwiper={setThumbsSwiper}
          watchSlidesProgress
          slidesPerView={thumbnailLayout === 'horizontal' ? 5 : 4}
          spaceBetween={12}
          className={cn(
            'thumbnail-swiper',
            thumbnailLayout === 'horizontal' ? '' : 'max-h-96'
          )}
          freeMode
          breakpoints={{
            0: { slidesPerView: 4 },
            640: { slidesPerView: 5 },
            1024: { slidesPerView: 6 },
          }}
        >
          {processedImages.map((src, index) => (
            <SwiperSlide key={`thumb-${src}-${index}`}>
              <button
                type="button"
                className="relative w-full h-20 overflow-hidden rounded-lg border-2 border-transparent aria-selected:border-amber-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                aria-label={`Şəkil ${index + 1}`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="120px"
                  className="object-cover"
                  loading="lazy"
                  quality={60}
                />
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {zoomIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setZoomIndex(null)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 text-white text-3xl focus:outline-none"
            aria-label="Bağla"
          >
            ×
          </button>
          <div className="relative h-full w-full max-w-5xl">
            <Image
              src={processedImages[zoomIndex]}
              alt={`${carInfo.brand} ${carInfo.model} ${carInfo.year} şəkil ${zoomIndex + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}
    </div>
  );
}