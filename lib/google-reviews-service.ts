// Google Places API interfaces
interface GooglePlacesReview {
  author_name: string;
  author_url?: string;
  language: string;
  profile_photo_url: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

interface GooglePlaceDetails {
  result: {
    name: string;
    rating: number;
    user_ratings_total: number;
    reviews: GooglePlacesReview[];
  };
  status: string;
}

// Google My Business API interfaces
interface GoogleMyBusinessReview {
  reviewId: string;
  reviewer: {
    profilePhotoUrl?: string;
    displayName: string;
    isAnonymous?: boolean;
  };
  starRating: 'ONE' | 'TWO' | 'THREE' | 'FOUR' | 'FIVE';
  comment?: string;
  createTime: string;
  updateTime: string;
  reviewReply?: {
    comment: string;
    updateTime: string;
  };
}

interface GoogleMyBusinessResponse {
  reviews: GoogleMyBusinessReview[];
  nextPageToken?: string;
  totalReviewCount: number;
  averageRating: number;
}

interface ProcessedReview {
  id: string;
  customerName: string;
  rating: number;
  reviewText: string;
  date: string;
  verified: boolean;
  source: 'google';
  profilePhoto?: string;
  language: string;
  relativeTime: string;
  isAnonymous?: boolean;
  hasReply?: boolean;
  replyText?: string;
}

class GoogleReviewsService {
  private apiKey: string;
  private placeId: string;
  private accountId: string;
  private locationId: string;
  private placesBaseUrl = 'https://maps.googleapis.com/maps/api/place';
  private myBusinessBaseUrl = 'https://mybusiness.googleapis.com/v4';

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || '';
    this.placeId = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID || '';
    this.accountId = process.env.NEXT_PUBLIC_GOOGLE_ACCOUNT_ID || '';
    this.locationId = process.env.NEXT_PUBLIC_GOOGLE_LOCATION_ID || '';
    
    if (!this.apiKey) {
      console.warn('Google API key təyin edilməyib');
    }
  }

  /**
   * Google My Business API-dən yorumları çəkir (daha çox yorumlar)
   */
  async fetchMyBusinessReviews(): Promise<{
    reviews: ProcessedReview[];
    averageRating: number;
    totalReviews: number;
  }> {
    if (!this.apiKey || !this.accountId || !this.locationId) {
      throw new Error('Google My Business API konfiqurasiyası tamamlanmayıb');
    }

    try {
      const url = `${this.myBusinessBaseUrl}/accounts/${this.accountId}/locations/${this.locationId}/reviews?key=${this.apiKey}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Google My Business API xətası: ${response.status}`);
      }

      const data: GoogleMyBusinessResponse = await response.json();
      const processedReviews = this.processMyBusinessReviews(data.reviews || []);

      return {
        reviews: processedReviews,
        averageRating: data.averageRating || 0,
        totalReviews: data.totalReviewCount || 0
      };
    } catch (error) {
      console.error('Google My Business yorumları çəkilərkən xəta:', error);
      throw error;
    }
  }

  /**
   * Google Places API-dən yorumları çəkir (fallback)
   */
  async fetchPlacesReviews(): Promise<{
    reviews: ProcessedReview[];
    averageRating: number;
    totalReviews: number;
  }> {
    if (!this.apiKey || !this.placeId) {
      throw new Error('Google Places API konfiqurasiyası tamamlanmayıb');
    }

    try {
      const url = `${this.placesBaseUrl}/details/json?place_id=${this.placeId}&fields=name,rating,user_ratings_total,reviews&key=${this.apiKey}&language=az`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Google Places API xətası: ${response.status}`);
      }

      const data: GooglePlaceDetails = await response.json();

      if (data.status !== 'OK') {
        throw new Error(`Google Places API status xətası: ${data.status}`);
      }

      const processedReviews = this.processPlacesReviews(data.result.reviews || []);

      return {
        reviews: processedReviews,
        averageRating: data.result.rating || 0,
        totalReviews: data.result.user_ratings_total || 0
      };
    } catch (error) {
      console.error('Google Places yorumları çəkilərkən xəta:', error);
      throw error;
    }
  }

  /**
   * Bütün mənbələrdən yorumları çəkir (prioritet sırası ilə)
   */
  async fetchGoogleReviews(): Promise<{
    reviews: ProcessedReview[];
    averageRating: number;
    totalReviews: number;
  }> {
    // Əvvəlcə Google My Business API-ni cəhd et
    if (this.accountId && this.locationId) {
      try {
        console.log('Google My Business API-dən yorumlar çəkilir...');
        return await this.fetchMyBusinessReviews();
      } catch (error) {
        console.warn('Google My Business API xətası, Places API-yə keçilir:', error);
      }
    }

    // Sonra Google Places API-ni cəhd et
    if (this.placeId) {
      try {
        console.log('Google Places API-dən yorumlar çəkilir...');
        return await this.fetchPlacesReviews();
      } catch (error) {
        console.error('Google Places API də xəta:', error);
        throw error;
      }
    }

    throw new Error('Heç bir Google API konfiqurasiyası tapılmadı');
  }

  /**
   * Google My Business yorumlarını bizim format'a çevirir
   */
  private processMyBusinessReviews(reviews: GoogleMyBusinessReview[]): ProcessedReview[] {
    return reviews.map((review) => ({
      id: `gmb-${review.reviewId}`,
      customerName: review.reviewer.displayName || 'Anonim İstifadəçi',
      rating: this.convertStarRating(review.starRating),
      reviewText: review.comment || '',
      date: review.createTime,
      verified: true,
      source: 'google' as const,
      profilePhoto: review.reviewer.profilePhotoUrl,
      language: 'az', // My Business API dil məlumatı vermir
      relativeTime: this.getRelativeTime(review.createTime),
      isAnonymous: review.reviewer.isAnonymous,
      hasReply: !!review.reviewReply,
      replyText: review.reviewReply?.comment
    }));
  }

  /**
   * Google Places yorumlarını bizim format'a çevirir
   */
  private processPlacesReviews(googleReviews: GooglePlacesReview[]): ProcessedReview[] {
    return googleReviews.map((review, index) => ({
      id: `places-${review.time}-${index}`,
      customerName: review.author_name,
      rating: review.rating,
      reviewText: review.text || '',
      date: new Date(review.time * 1000).toISOString(),
      verified: true,
      source: 'google' as const,
      profilePhoto: review.profile_photo_url,
      language: review.language,
      relativeTime: review.relative_time_description
    }));
  }

  /**
   * Google My Business star rating'i rəqəmə çevirir
   */
  private convertStarRating(starRating: string): number {
    const ratingMap: Record<string, number> = {
      'ONE': 1,
      'TWO': 2,
      'THREE': 3,
      'FOUR': 4,
      'FIVE': 5
    };
    return ratingMap[starRating] || 5;
  }

  /**
   * ISO date string-dən relative time yaradır
   */
  private getRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Bu gün';
    if (diffInDays === 1) return 'Dünən';
    if (diffInDays < 7) return `${diffInDays} gün əvvəl`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} həftə əvvəl`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} ay əvvəl`;
    return `${Math.floor(diffInDays / 365)} il əvvəl`;
  }

  /**
   * Yorumları cache-lə birlikdə çəkir
   */
  async getReviewsWithCache(maxAge: number = 3600000): Promise<{
    reviews: ProcessedReview[];
    averageRating: number;
    totalReviews: number;
  }> {
    const cacheKey = 'google-reviews-cache';
    const cached = this.getFromCache(cacheKey);

    if (cached && Date.now() - cached.timestamp < maxAge) {
      return cached.data;
    }

    try {
      const freshData = await this.fetchGoogleReviews();
      this.saveToCache(cacheKey, freshData);
      return freshData;
    } catch (error) {
      // Əgər API xətası varsa və cache-də məlumat varsa, cache-dən istifadə et
      if (cached) {
        console.warn('Google API xətası, cache-dən istifadə edilir:', error);
        return cached.data;
      }
      throw error;
    }
  }

  /**
   * Browser localStorage-dan cache oxuyur
   */
  private getFromCache(key: string): { data: any; timestamp: number } | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const cached = localStorage.getItem(key);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  }

  /**
   * Browser localStorage-a cache yazır
   */
  private saveToCache(key: string, data: any): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(key, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.warn('Cache yazılarkən xəta:', error);
    }
  }

  /**
   * Yorumları dil və rating-ə görə filtrləyir
   */
  filterReviews(
    reviews: ProcessedReview[],
    options: {
      minRating?: number;
      language?: string;
      limit?: number;
    } = {}
  ): ProcessedReview[] {
    let filtered = [...reviews];

    // Rating filtri
    if (options.minRating) {
      filtered = filtered.filter(review => review.rating >= options.minRating!);
    }

    // Dil filtri
    if (options.language) {
      filtered = filtered.filter(review => 
        review.language === options.language || 
        review.language === 'az' || // Azərbaycan dilini həmişə daxil et
        !review.language // Dil məlumatı olmayan yorumları da daxil et
      );
    }

    // Tarixi sırala (ən yeni əvvəl)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Limit tətbiq et
    if (options.limit) {
      filtered = filtered.slice(0, options.limit);
    }

    return filtered;
  }
}

export const googleReviewsService = new GoogleReviewsService();
export type { ProcessedReview, GooglePlacesReview, GoogleMyBusinessReview };