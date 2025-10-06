'use client';

import React, { useState, useEffect, memo, useCallback, useRef } from 'react';
import { CustomerReview } from '@/lib/types';
import { customerReviews } from '@/lib/data';

import StarRating from './StarRating';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { Alert, AlertDescription } from './ui/alert';
import { AlertCircle, CheckCircle, MessageSquare, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface GoogleReviewsProps {
  maxReviews?: number;
  showRating?: boolean;
  autoScroll?: boolean;
  currentLang: string;
  className?: string;
  useGoogleAPI?: boolean;
  minRating?: number;
}

const GoogleReviews = memo(function GoogleReviews({
  maxReviews = 6,
  showRating = true,
  autoScroll = true,
  currentLang = 'az',
  className = '',
  useGoogleAPI = false,
  minRating = 1
}: GoogleReviewsProps) {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load local reviews
  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate loading delay for better UX
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Filter reviews by rating if needed
        const filteredReviews = customerReviews
          .filter(review => review.rating >= minRating)
          .slice(0, maxReviews);
        
        const avgRating = customerReviews.reduce((sum, review) => sum + review.rating, 0) / customerReviews.length;
        
        setReviews(filteredReviews);
        setAverageRating(avgRating);
        setTotalReviews(customerReviews.length);
        
      } catch (err) {
        console.error('Yorumlar yüklənərkən xəta:', err);
        setError('Yorumlar yüklənərkən xəta baş verdi');
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [maxReviews, minRating]);

  // Carousel auto-scroll
  useEffect(() => {
    if (!autoScroll || reviews.length <= 1) return;
    if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    autoTimerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 3500);
    return () => {
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    };
  }, [autoScroll, reviews.length]);

  const goTo = useCallback((idx: number) => {
    if (reviews.length === 0) return;
    const normalized = ((idx % reviews.length) + reviews.length) % reviews.length;
    setCurrentIndex(normalized);
  }, [reviews.length]);

  const next = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);
  const prev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);

  // Format date based on language - memoized for performance
  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);

    // Use consistent formatting to prevent hydration mismatch
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    if (currentLang === 'az') {
      const months = [
        'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
        'iyul', 'avqust', 'sentyabr', 'oktyabr', 'noyabr', 'dekabr'
      ];
      return `${day} ${months[date.getMonth()]} ${year}`;
    }
    
    return `${day}/${month}/${year}`;
  }, [currentLang]);

  // Get source badge color - memoized for performance
  const getSourceBadgeColor = useCallback((source: string) => {
    switch (source) {
      case 'google':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'facebook':
        return 'bg-blue-600 text-white';
      case 'internal':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-[#1a1a1a] dark:text-gray-300';
    }
  }, []);

  // Get source display name - memoized for performance
  const getSourceDisplayName = useCallback((source: string) => {
    switch (source) {
      case 'google':
        return 'Google';
      case 'facebook':
        return 'Facebook';
      case 'internal':
        return currentLang === 'az' ? 'Daxili' : currentLang === 'en' ? 'Internal' : currentLang === 'ru' ? 'Внутренний' : 'داخلي';
      default:
        return source;
    }
  }, [currentLang]);

  // Translations
  const translations = {
    az: {
      title: 'Müştəri Rəyləri',
      subtitle: 'Müştərilərimizin bizim haqqımızda dedikləri',
      verified: 'Təsdiqlənmiş',
      helpful: 'faydalı',
      noReviews: 'Hələ rəy yoxdur',
      loadingError: 'Rəylər yüklənərkən xəta baş verdi',
      averageRating: 'Orta reytinq',
      totalReviews: 'rəy',
      rented: 'icarəyə götürüb',
      refresh: 'Yenilə',
      googleReviews: 'Google Rəyləri',
      fromGoogle: 'Google-dan'
    },
    en: {
      title: 'Customer Reviews',
      subtitle: 'What our customers say about us',
      verified: 'Verified',
      helpful: 'helpful',
      noReviews: 'No reviews yet',
      loadingError: 'Error loading reviews',
      averageRating: 'Average rating',
      totalReviews: 'reviews',
      rented: 'rented',
      refresh: 'Refresh',
      googleReviews: 'Google Reviews',
      fromGoogle: 'From Google'
    },
    ru: {
      title: 'Отзывы Клиентов',
      subtitle: 'Что говорят о нас наши клиенты',
      verified: 'Проверено',
      helpful: 'полезно',
      noReviews: 'Пока нет отзывов',
      loadingError: 'Ошибка загрузки отзывов',
      averageRating: 'Средний рейтинг',
      totalReviews: 'отзывов',
      rented: 'арендовал',
      refresh: 'Обновить',
      googleReviews: 'Отзывы Google',
      fromGoogle: 'Из Google'
    },
    ar: {
      title: 'آراء العملاء',
      subtitle: 'ما يقوله عملاؤنا عنا',
      verified: 'موثق',
      helpful: 'مفيد',
      noReviews: 'لا توجد مراجعات بعد',
      loadingError: 'خطأ في تحميل المراجعات',
      averageRating: 'متوسط التقييم',
      totalReviews: 'مراجعة',
      rented: 'استأجر',
      refresh: 'تحديث',
      googleReviews: 'مراجعات جوجل',
      fromGoogle: 'من جوجل'
    }
  };

  const t = translations[currentLang as keyof typeof translations] || translations.az;

  // Loading state
  if (loading) {
    return (
      <section className={`py-20 bg-white/70 dark:bg-[#1a1a1a] ${className}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Skeleton className="h-8 w-32 mx-auto mb-6 rounded-full" />
            <Skeleton className="h-12 w-96 mx-auto mb-6 rounded-2xl" />
            <div className="flex items-center justify-center gap-6 mb-12">
              <div className="flex items-center gap-3 px-6 py-4 bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-lg">
                <Skeleton className="h-8 w-12 rounded" />
                <div className="flex flex-col">
                  <Skeleton className="h-6 w-24 mb-2 rounded" />
                  <Skeleton className="h-4 w-16 rounded" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <Card className="bg-white/80 dark:bg-[#1a1a1a] backdrop-blur-sm border-0 shadow-xl rounded-3xl">
              <CardContent className="p-8 sm:p-10">
                <div className="flex justify-center mb-6">
                  <Skeleton className="h-16 w-16 rounded-full" />
                </div>
                <div className="text-center mb-8">
                  <Skeleton className="h-6 w-full mb-3 rounded" />
                  <Skeleton className="h-6 w-4/5 mx-auto mb-3 rounded" />
                  <Skeleton className="h-6 w-3/4 mx-auto rounded" />
                </div>
                <div className="flex justify-center mb-6">
                  <Skeleton className="h-6 w-32 rounded" />
                </div>
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-14 w-14 rounded-full" />
                    <div>
                      <Skeleton className="h-5 w-24 mb-2 rounded" />
                      <Skeleton className="h-4 w-20 rounded" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className={`py-20 bg-white/70 dark:bg-[#1a1a1a] ${className}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <Alert className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 rounded-2xl p-6">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <AlertDescription className="text-red-700 dark:text-red-300 ml-2">
                {t.loadingError}
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </section>
    );
  }

  // No reviews state
  if (reviews.length === 0) {
    return (
      <section className={`py-20 bg-white/70 dark:bg-[#1a1a1a] ${className}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-md mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="h-10 w-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t.title}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {t.noReviews}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-20 bg-white/70 dark:bg-[#1a1a1a] ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-[#1a1a1a]
          rounded-full text-gray-700 dark:text-gray-300 text-sm font-medium mb-6">
            <MessageSquare className="w-4 h-4" />
            {t.title}
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {t.subtitle}
          </h2>
          
          {/* Average Rating Display */}
          {showRating && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
              <div className="flex items-center gap-3 px-6 py-4 bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                <div className="text-3xl font-bold text-yellow-500">{averageRating.toFixed(1)}</div>
                <div className="flex flex-col">
                  <StarRating rating={averageRating} size="lg" showRating={false} />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {totalReviews} {t.totalReviews}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>{t.verified} {t.totalReviews}</span>
              </div>
            </div>
          )}
        </div>

        {/* Reviews Carousel */}
        <div className="relative max-w-5xl mx-auto">
          {/* Navigation Buttons */}
          {reviews.length > 1 && (
            <>
              <button
                aria-label="Previous review"
                onClick={prev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white dark:bg-[#1a1a1a] rounded-full shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-105 transition-all duration-200"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <button
                aria-label="Next review"
                onClick={next}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white dark:bg-[#1a1a1a] rounded-full shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] hover:scale-105 transition-all duration-200"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          <div className="overflow-hidden rounded-3xl">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {reviews.map((review) => (
                <div key={review.id} className="w-full flex-shrink-0 px-4 sm:px-8">
                  <Card className="bg-white/80 dark:bg-[#262626] backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                    <CardContent className="p-8 sm:p-10">
                      {/* Quote Icon */}
                      <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] dark:from-gray-400 dark:to-gray-600 rounded-full flex items-center justify-center">
                          <Quote className="w-8 h-8 text-white dark:text-gray-900" />
                        </div>
                      </div>

                      {/* Review Text */}
                      <div className="text-center mb-8">
                        <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 leading-relaxed font-medium italic">
                          `{review.reviewText}`
                        </p>
                      </div>

                      {/* Rating */}
                      <div className="flex justify-center mb-6">
                        <StarRating rating={review.rating} size="lg" showRating={false} />
                      </div>

                      {/* Customer Info */}
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] dark:from-gray-400 dark:to-gray-600 rounded-full flex items-center justify-center text-white dark:text-gray-900 font-bold text-lg shadow-lg">
                            {review.customerName.charAt(0).toUpperCase()}
                          </div>
                          
                          <div className="text-center sm:text-left">
                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                              {review.customerName}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {formatDate(review.date)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {review.verified && (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              {t.verified}
                            </Badge>
                          )}
                          
                          <Badge className={`${getSourceBadgeColor(review.source)} border-0`}>
                            {getSourceDisplayName(review.source)}
                          </Badge>
                        </div>
                      </div>



                      {/* Additional Info */}
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-6">
                        {review.carRented && (
                          <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                            <span>{t.rented}:</span>
                            <span className="font-medium text-gray-700 dark:text-gray-300">{review.carRented}</span>
                          </div>
                        )}
                        
                        {review.helpful && review.helpful > 0 && (
                          <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                            <span>👍</span>
                            <span>{review.helpful} {t.helpful}</span>
                          </div>
                        )}
                        
                        {review.source === 'google' && (
                          <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                            <span>🌟</span>
                            <span>Google</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          {reviews.length > 1 && (
            <div className="flex items-center justify-center gap-3 mt-8">
              {reviews.map((_, idx) => (
                <button
                  key={idx}
                  aria-label={`Go to slide ${idx + 1}`}
                  onClick={() => goTo(idx)}
                  className={`transition-all duration-300 ${
                    currentIndex === idx 
                      ? 'w-8 h-3 bg-gradient-to-r from-[#2a2a2a] to-[#1a1a1a] dark:from-gray-400 dark:to-gray-600 rounded-full' 
                      : 'w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-full hover:bg-gray-400 dark:hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
});

export default GoogleReviews;