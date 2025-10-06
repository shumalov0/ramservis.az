'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
    
    // Log to analytics (guarded for TypeScript and runtime safety)
    if (typeof window !== 'undefined') {
      const w = window as Window & typeof globalThis & { gtag?: (...args: unknown[]) => void };
      if (typeof w.gtag === 'function') {
        w.gtag('event', 'exception', {
          description: error.message,
          fatal: false,
        });
      }
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-lg border border-gray-200">
          <AlertTriangle className="w-12 h-12 text-amber-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Something went wrong
          </h3>
          <p className="text-gray-600 mb-4 max-w-md">
            We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
          </p>
          <div className="flex gap-3">
            <Button onClick={this.handleRetry} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button 
              onClick={() => window.location.reload()} 
              variant="default" 
              size="sm"
            >
              Refresh Page
            </Button>
          </div>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-4 text-left">
              <summary className="cursor-pointer text-sm text-gray-500">
                Error Details (Development)
              </summary>
              <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto max-w-full">
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

// Functional wrapper for easier usage
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}