'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, ThumbsUp, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { CustomerReview } from '@/lib/types';
import { customerReviews } from '@/lib/data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CustomerReviewsProps {
  carId: string;
  carModel?: string;
  maxReviews?: number;
}

type FilterType = 'all' | 'verified' | 'recent' | 'high-rating';
type SortType = 'newest' | 'oldest' | 'rating-high' | 'rating-low' | 'helpful';

export default function CustomerReviews({ carId, carModel, maxReviews = 6 }: CustomerReviewsProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('newest');
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());

  // Filter and sort reviews
  const processedReviews = useMemo(() => {
    let filtered = customerReviews;

    // Apply filters
    switch (filter) {
      case 'verified':
        filtered = filtered.filter(review => review.verified);
        break;
      case 'recent':
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        filtered = filtered.filter(review => new Date(review.date) >= thirtyDaysAgo);
        break;
      case 'high-rating':
        filtered = filtered.filter(review => review.rating >= 4);
        break;
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'rating-high':
          return b.rating - a.rating;
        case 'rating-low':
          return a.rating - b.rating;
        case 'helpful':
          return (b.helpful || 0) - (a.helpful || 0);
        default:
          return 0;
      }
    });

    return sorted.slice(0, maxReviews);
  }, [filter, sortBy, maxReviews]);

  const reviewsPerPage = 3;
  const totalPages = Math.ceil(processedReviews.length / reviewsPerPage);
  const currentReviews = processedReviews.slice(
    currentPage * reviewsPerPage,
    (currentPage + 1) * reviewsPerPage
  );

  // Calculate average rating
  const averageRating = useMemo(() => {
    if (processedReviews.length === 0) return 0;
    const sum = processedReviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / processedReviews.length;
  }, [processedReviews]);

  // Rating distribution
  const ratingDistribution = useMemo(() => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    processedReviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  }, [processedReviews]);

  const toggleExpanded = (reviewId: string) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId);
    } else {
      newExpanded.add(reviewId);
    }
    setExpandedReviews(newExpanded);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const renderStars = (rating: number, size: 'sm' | 'md' = 'sm') => {
    const starSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  if (processedReviews.length === 0) {
    return (
      <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm w-full">
        <CardContent className="p-6 sm:p-8 text-center">
          <Star className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Reviews Yet
          </h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Be the first to share your experience with this car!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 w-full overflow-hidden">
      {/* Reviews Summary */}
      <Card className="bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-sm w-full">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span className="text-gray-900 dark:text-white text-lg sm:text-xl">Customer Reviews</span>
            <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 w-fit">
              {processedReviews.length} reviews
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Average Rating */}
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-amber-600 dark:text-amber-400 mb-2">
                {averageRating.toFixed(1)}
              </div>
              {renderStars(Math.round(averageRating), 'md')}
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Based on {processedReviews.length} reviews
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-2 min-w-0">
                  <span className="text-sm w-3 flex-shrink-0">{rating}</span>
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 min-w-0">
                    <div
                      className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${processedReviews.length > 0 ? (ratingDistribution[rating as keyof typeof ratingDistribution] / processedReviews.length) * 100 : 0}%`
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-6 sm:w-8 flex-shrink-0 text-right">
                    {ratingDistribution[rating as keyof typeof ratingDistribution]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Sorting */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center w-full">
        <div className="flex items-center space-x-2 min-w-0">
          <Filter className="h-4 w-4 text-gray-500 flex-shrink-0" />
          <Select value={filter} onValueChange={(value: FilterType) => setFilter(value)}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reviews</SelectItem>
              <SelectItem value="verified">Verified Only</SelectItem>
              <SelectItem value="recent">Recent (30 days)</SelectItem>
              <SelectItem value="high-rating">4+ Stars</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Select value={sortBy} onValueChange={(value: SortType) => setSortBy(value)}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="rating-high">Highest Rating</SelectItem>
            <SelectItem value="rating-low">Lowest Rating</SelectItem>
            <SelectItem value="helpful">Most Helpful</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reviews List */}
      <div className="space-y-3 sm:space-y-4 w-full">
        {currentReviews.map((review) => {
          const isExpanded = expandedReviews.has(review.id);
          const shouldTruncate = review.reviewText.length > 200;
          const displayText = isExpanded || !shouldTruncate 
            ? review.reviewText 
            : review.reviewText.substring(0, 200) + '...';

          return (
            <Card key={review.id} className="bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-sm w-full overflow-hidden">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start space-x-3 sm:space-x-4 min-w-0">
                  <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                    <AvatarFallback className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 text-xs sm:text-sm">
                      {getInitials(review.customerName)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">
                          {review.customerName}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          {renderStars(review.rating)}
                          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(review.date)}
                          </span>
                          {review.verified && (
                            <Badge variant="outline" className="text-xs border-green-500 text-green-700 dark:text-green-400">
                              Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <Badge variant="secondary" className="text-xs flex-shrink-0 w-fit">
                        {review.source}
                      </Badge>
                    </div>

                    {review.carRented && (
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                        Rented: {review.carRented}
                      </p>
                    )}

                    <div className="min-w-0">
                      <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed break-words">
                        {displayText}
                      </p>

                      {shouldTruncate && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpanded(review.id)}
                          className="p-0 h-auto text-amber-600 hover:text-amber-700 mt-2"
                        >
                          {isExpanded ? 'Show less' : 'Read more'}
                        </Button>
                      )}
                    </div>

                    {review.helpful && review.helpful > 0 && (
                      <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        <ThumbsUp className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="truncate">{review.helpful} people found this helpful</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
            className="w-full sm:w-auto"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          
          <div className="flex space-x-1 sm:space-x-2 overflow-x-auto max-w-full">
            {Array.from({ length: totalPages }).map((_, index) => (
              <Button
                key={index}
                variant={currentPage === index ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(index)}
                className="h-8 w-8 p-0 flex-shrink-0"
              >
                {index + 1}
              </Button>
            ))}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
            disabled={currentPage === totalPages - 1}
            className="w-full sm:w-auto"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}