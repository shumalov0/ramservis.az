// Enhanced Image Gallery Components
export { default as ImageGallery } from './ImageGallery';
export { default as MainImageViewer } from './MainImageViewer';
export { default as ThumbnailStrip } from './ThumbnailStrip';
export { default as FullscreenLightbox } from './FullscreenLightbox';

// Types for gallery components
export interface GalleryProps {
  images: string[];
  carInfo: { brand: string; model: string; year: number };
  className?: string;
  thumbnailLayout?: 'horizontal' | 'vertical';
  enableLazyLoading?: boolean;
}

export interface MainImageViewerProps {
  images: string[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  onFullscreenOpen: () => void;
  carInfo: { brand: string; model: string; year: number };
}

export interface ThumbnailStripProps {
  images: string[];
  currentIndex: number;
  onThumbnailClick: (index: number) => void;
  layout?: 'horizontal' | 'vertical';
  carInfo: { brand: string; model: string; year: number };
}

export interface FullscreenLightboxProps {
  images: string[];
  isOpen: boolean;
  initialIndex: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  carInfo: { brand: string; model: string; year: number };
}