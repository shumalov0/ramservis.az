// Enhanced TypeScript interfaces for car rental enhancements

// Customer Review interface for Google Reviews integration
export interface CustomerReview {
  id: string;
  customerName: string;
  rating: number; // 1-5 stars
  reviewText: string;
  date: string;
  carRented?: string; // Optional car model/brand
  verified: boolean;
  helpful?: number; // Number of helpful votes
  source: 'google' | 'internal' | 'facebook';
}

// Certificate interface for certificates carousel
export interface Certificate {
  id: string;
  title: string;
  image: string;
  description: string;
  issueDate: string;
  validUntil?: string;
  issuer: string;
  credentialId?: string;
}

// Enhanced Car interface extending the existing one
export interface EnhancedCar {
  // Existing fields from original Car interface
  id: string;
  brand: string;
  model: string;
  year: number;
  class: string;
  fuelType: string;
  transmission: string;
  engineSize: string;
  seats: number;
  dailyPrice: number;
  weeklyPrice: number;
  monthlyPrice: number;
  deposit: number;
  image: string; // primary image (legacy)
  images?: string[]; // gallery images (4-5)
  features: string[];
  rules: {
    minimumAge: number;
    drivingExperience: number;
    passportRequired: boolean;
    licenseRequired: boolean;
  };
  
  // New enhanced fields
  category: 'SUV' | 'Sedan' | 'Hatchback' | 'Premium' | 'Luxury' | 'Economy' | 'Business' | 'Comfort' | 'Ekonom' | 'Biznes' | 'Lüks';
  popularity: number; // For sorting by popularity (0-100)
  availability: boolean;
  gallery: string[]; // Multiple images for enhanced gallery
  specifications: {
    engine: string;
    horsepower: number;
    acceleration: string; // e.g., "0-100 km/h in 8.5s"
    topSpeed: number; // km/h
    fuelConsumption: string; // e.g., "6.5L/100km"
  };
}

// Booking form data interface with Formik integration
export interface BookingFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Rental Details
  carId: string;
  pickupDate: string;
  dropoffDate: string;
  pickupLocation: string;
  dropoffLocation: string;
  
  // Additional Services
  additionalServices: string[];
  paymentMethod: 'cash' | 'online';
  
  // Special Requirements
  specialRequests?: string;
  
  // Calculated Fields (computed during form interaction)
  totalDays: number;
  totalPrice: number;
  deposit: number;
  serviceCharges: number;

  // Submission/confirmation fields (set after successful submission)
  confirmationNumber?: string;
  paymentLink?: string;
}

// Car filters interface for enhanced filtering functionality
export interface CarFilters {
  category?: string[];
  priceRange?: [number, number]; // [min, max] daily price
  year?: [number, number]; // [min, max] year
  fuelType?: string[];
  transmission?: string[];
  features?: string[];
  seats?: number[];
  class?: string[];
  availability?: boolean;
}

// Car category interface for navigation dropdown
export interface CarCategory {
  id: string;
  name: string;
  displayName: string; // Localized display name
  icon?: string; // Optional icon for the category
  description?: string;
  count?: number; // Number of cars in this category
}

// Sort options for car listings
export type CarSortOption = 'price-asc' | 'price-desc' | 'year-asc' | 'year-desc' | 'popularity' | 'name';

// Pagination interface
export interface PaginationOptions {
  page: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

// Search and filter state interface
export interface CarSearchState {
  filters: CarFilters;
  sortBy: CarSortOption;
  searchQuery: string;
  pagination: PaginationOptions;
}

// Form validation error interface
export interface FormValidationError {
  field: string;
  message: string;
  type: 'required' | 'format' | 'min' | 'max' | 'custom';
}

// Email template data interface
export interface EmailTemplateData {
  customerName: string;
  carDetails: {
    brand: string;
    model: string;
    year: number;
  };
  bookingDetails: BookingFormData;
  totalAmount: number;
  paymentLink?: string; // For Click2Pay integration
  confirmationNumber: string;
}

// WhatsApp integration interface
export interface WhatsAppConfig {
  phoneNumber: string;
  defaultMessage: string;
  contextualMessages: {
    booking: string;
    inquiry: string;
    support: string;
  };
}

// Three.js background configuration
export interface ThreeBackgroundConfig {
  scene: 'particles' | 'geometric' | 'minimal';
  intensity: 'low' | 'medium' | 'high';
  color: string;
  responsive: boolean;
  reducedMotion: boolean;
}

// API response interfaces
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ReviewsApiResponse extends ApiResponse<CustomerReview[]> {
  totalReviews: number;
  averageRating: number;
}

// Language support interface
export interface LanguageConfig {
  code: string;
  name: string;
  flag: string;
  rtl: boolean;
}