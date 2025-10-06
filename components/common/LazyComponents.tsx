'use client';

import dynamic from 'next/dynamic';
import { ComponentSkeleton, GallerySkeleton, CarInfoSkeleton } from './FallbackComponents';
import { ErrorBoundary } from './ErrorBoundary';

// Lazy load heavy gallery components
export const LazyImageGallery = dynamic(
  () => import('@/components/gallery/ImageGallery').then(mod => ({ default: mod.default })),
  {
    loading: () => <GallerySkeleton />,
    ssr: false
  }
);

export const LazyFullscreenLightbox = dynamic(
  () => import('@/components/gallery/FullscreenLightbox').then(mod => ({ default: mod.default })),
  {
    loading: () => <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
    </div>,
    ssr: false
  }
);

// Lazy load booking components
export const LazyInlineBookingForm = dynamic(
  () => import('@/components/booking/InlineBookingForm').then(mod => ({ default: mod.default })),
  {
    loading: () => <ComponentSkeleton className="h-96" />,
    ssr: false
  }
);

export const LazyPriceCalculator = dynamic(
  () => import('@/components/booking/PriceCalculator').then(mod => ({ default: mod.PriceCalculator })),
  {
    loading: () => <ComponentSkeleton className="h-32" />,
    ssr: false
  }
);

// Removed LazyCarInfoDemo as the component was deleted

export const LazySpecificationsTabs = dynamic(
  () => import('@/components/car-info/SpecificationsTabs').then(mod => ({ default: mod.SpecificationsTabs })),
  {
    loading: () => <ComponentSkeleton className="h-64" />,
    ssr: false
  }
);

// Lazy load dynamic features
export const LazySimilarCars = dynamic(
  () => import('@/components/dynamic/SimilarCars').then(mod => ({ default: mod.default })),
  {
    loading: () => <ComponentSkeleton className="h-48" />,
    ssr: false
  }
);

export const LazyCustomerReviews = dynamic(
  () => import('@/components/dynamic/CustomerReviews').then(mod => ({ default: mod.default })),
  {
    loading: () => <ComponentSkeleton className="h-64" />,
    ssr: false
  }
);

export const LazyGoogleMap = dynamic(
  () => import('@/components/GoogleMap'),
  {
    loading: () => <ComponentSkeleton className="h-96" />,
    ssr: false
  }
);

// Removed animation components as they were deleted for better performance

// Higher-order component for lazy loading with error boundary
export function withLazyLoading<P extends object>(
  importFn: () => Promise<{ default: React.ComponentType<P> }>,
  LoadingComponent?: React.ComponentType,
  fallbackMessage?: string
) {
  const LazyComponent = dynamic(importFn, {
    loading: LoadingComponent ? () => <LoadingComponent /> : () => <ComponentSkeleton className="h-32" />,
    ssr: false
  });

  return function LazyWrapper(props: P) {
    return (
      <ErrorBoundary
        fallback={
          <div className="p-4 text-center text-gray-500">
            {fallbackMessage || 'Failed to load component'}
          </div>
        }
      >
        <LazyComponent {...props} />
      </ErrorBoundary>
    );
  };
}

// Preload functions for critical components
export const preloadComponents = {
  imageGallery: () => import('@/components/gallery/ImageGallery'),
  bookingForm: () => import('@/components/booking/InlineBookingForm'),
  similarCars: () => import('@/components/dynamic/SimilarCars'),
};

// Utility to preload components based on user interaction
export function preloadOnHover(componentKey: keyof typeof preloadComponents) {
  return {
    onMouseEnter: () => preloadComponents[componentKey](),
    onFocus: () => preloadComponents[componentKey](),
  };
}

// Bundle splitting configuration helper
export const bundleConfig = {
  // Critical components that should be in main bundle
  critical: [
    'OptimizedImage',
    'ErrorBoundary',
    'LoadingSpinner'
  ],
  
  // Components that can be lazy loaded
  lazy: [
    'ImageGallery',
    'FullscreenLightbox',
    'InlineBookingForm',
    'PriceCalculator',
    'SpecificationsTabs',
    'SimilarCars',
    'CustomerReviews'
  ],
  
  // Animation components (lowest priority)
  animations: [
    'ScrollAnimations',
    'MicroInteractions',
    'TouchGestures'
  ]
};