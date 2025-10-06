'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/hooks/use-favorites';
import { toast } from '@/hooks/use-toast';

interface FavoriteButtonProps {
  carId: string;
  carName?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost' | 'outline';
  showLabel?: boolean;
  className?: string;
}

export default function FavoriteButton({ 
  carId, 
  carName,
  size = 'md',
  variant = 'ghost',
  showLabel = false,
  className = ''
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [isAnimating, setIsAnimating] = useState(false);
  const favorite = isFavorite(carId);

  const sizeClasses = {
    sm: 'h-8 w-8 p-0',
    md: 'h-10 w-10 p-0',
    lg: 'h-12 w-12 p-0'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAnimating(true);
    toggleFavorite(carId);
    
    // Show toast notification
    const action = favorite ? 'removed from' : 'added to';
    toast({
      title: `${favorite ? 'Removed from' : 'Added to'} favorites`,
      description: carName 
        ? `${carName} has been ${action} your favorites.`
        : `Car has been ${action} your favorites.`,
      duration: 2000,
    });

    // Reset animation after a short delay
    setTimeout(() => setIsAnimating(false), 300);
  };

  const buttonContent = (
    <>
      <Heart 
        className={`${iconSizes[size]} transition-all duration-200 ${
          favorite 
            ? 'fill-red-500 text-red-500' 
            : 'text-gray-400 hover:text-red-400'
        } ${isAnimating ? 'scale-125' : 'scale-100'}`} 
      />
      {showLabel && (
        <span className="ml-2 text-sm">
          {favorite ? 'Favorited' : 'Add to Favorites'}
        </span>
      )}
    </>
  );

  if (showLabel) {
    return (
      <Button
        onClick={handleToggle}
        variant={variant}
        className={`flex items-center space-x-2 ${className}`}
      >
        {buttonContent}
      </Button>
    );
  }

  return (
    <Button
      onClick={handleToggle}
      variant={variant}
      className={`${sizeClasses[size]} ${className} ${
        favorite 
          ? 'bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30' 
          : 'hover:bg-gray-100 dark:hover:bg-[#1a1a1a]'
      }`}
      title={favorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      {buttonContent}
    </Button>
  );
}