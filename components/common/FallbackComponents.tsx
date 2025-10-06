'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react';

interface FallbackProps {
  onRetry?: () => void;
  message?: string;
}

export function ImageLoadError({ onRetry, message }: FallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mb-3">
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <p className="text-sm text-gray-600 mb-3 text-center">
        {message || 'Unable to load image'}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      )}
    </div>
  );
}

export function NetworkError({ onRetry, message }: FallbackProps) {
  return (
    <Card className="p-6 text-center">
      <WifiOff className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Connection Error
      </h3>
      <p className="text-gray-600 mb-4">
        {message || 'Unable to connect to the server. Please check your internet connection.'}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="default">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      )}
    </Card>
  );
}

export function LoadingError({ onRetry, message }: FallbackProps) {
  return (
    <Card className="p-6 text-center">
      <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Loading Error
      </h3>
      <p className="text-gray-600 mb-4">
        {message || 'Something went wrong while loading this content.'}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="default">
          <RefreshCw className="w-4 h-4 mr-2" />
          Reload
        </Button>
      )}
    </Card>
  );
}

export function DataNotFound({ message }: { message?: string }) {
  return (
    <Card className="p-8 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291-1.007-5.824-2.562M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No Data Available
      </h3>
      <p className="text-gray-600">
        {message || 'The requested information is not available at this time.'}
      </p>
    </Card>
  );
}

export function ComponentSkeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-gray-200 rounded-lg h-full"></div>
    </div>
  );
}

export function GallerySkeleton() {
  return (
    <div className="space-y-4">
      <div className="aspect-video bg-gray-200 rounded-lg animate-pulse"></div>
      <div className="flex gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-20 h-16 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
    </div>
  );
}

export function CarInfoSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  );
}