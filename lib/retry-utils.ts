import { useState, useEffect } from 'react';

interface RetryOptions {
  maxAttempts?: number;
  delay?: number;
  backoff?: 'linear' | 'exponential';
  onRetry?: (attempt: number, error: Error) => void;
  shouldRetry?: (error: Error) => boolean;
}

export class RetryError extends Error {
  constructor(
    message: string,
    public attempts: number,
    public lastError: Error
  ) {
    super(message);
    this.name = 'RetryError';
  }
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delay = 1000,
    backoff = 'exponential',
    onRetry,
    shouldRetry = (error) => 
      error.name === 'NetworkError' || 
      error.message.includes('fetch') || 
      error.message.includes('Network error') ||
      error.message.includes('network')
  } = options;

  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxAttempts || !shouldRetry(lastError)) {
        throw new RetryError(
          `Failed after ${attempt} attempts: ${lastError.message}`,
          attempt,
          lastError
        );
      }
      
      onRetry?.(attempt, lastError);
      
      const waitTime = backoff === 'exponential' 
        ? delay * Math.pow(2, attempt - 1)
        : delay * attempt;
        
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  
  throw lastError!;
}

export function createRetryFetch(options: RetryOptions = {}) {
  return async function retryFetch(
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> {
    return withRetry(async () => {
      const response = await fetch(input, init);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response;
    }, {
      ...options,
      shouldRetry: (error) => {
        // Retry on network errors and 5xx server errors
        return error.message.includes('fetch') || 
               error.message.includes('NetworkError') ||
               error.message.includes('Network error') ||
               error.message.includes('HTTP 5');
      }
    });
  };
}

export class NetworkMonitor {
  private static instance: NetworkMonitor;
  private isOnline = navigator.onLine;
  private listeners: ((online: boolean) => void)[] = [];
  
  private constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.setOnlineStatus(true));
      window.addEventListener('offline', () => this.setOnlineStatus(false));
    }
  }
  
  static getInstance(): NetworkMonitor {
    if (!NetworkMonitor.instance) {
      NetworkMonitor.instance = new NetworkMonitor();
    }
    return NetworkMonitor.instance;
  }
  
  private setOnlineStatus(online: boolean) {
    this.isOnline = online;
    this.listeners.forEach(listener => listener(online));
  }
  
  getOnlineStatus(): boolean {
    return this.isOnline;
  }
  
  onStatusChange(callback: (online: boolean) => void): () => void {
    this.listeners.push(callback);
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }
  
  async waitForConnection(timeout = 30000): Promise<boolean> {
    if (this.isOnline) return true;
    
    return new Promise((resolve) => {
      const timeoutId = setTimeout(() => resolve(false), timeout);
      
      const unsubscribe = this.onStatusChange((online) => {
        if (online) {
          clearTimeout(timeoutId);
          unsubscribe();
          resolve(true);
        }
      });
    });
  }
}

// Hook for React components
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  
  useEffect(() => {
    const monitor = NetworkMonitor.getInstance();
    setIsOnline(monitor.getOnlineStatus());
    
    return monitor.onStatusChange(setIsOnline);
  }, []);
  
  return isOnline;
}

// Utility for API calls with automatic retry
export function createApiClient(baseURL: string, options: RetryOptions = {}) {
  const retryFetch = createRetryFetch(options);
  
  return {
    async get<T>(endpoint: string, init?: RequestInit): Promise<T> {
      const response = await retryFetch(`${baseURL}${endpoint}`, {
        ...init,
        method: 'GET',
      });
      return response.json();
    },
    
    async post<T>(endpoint: string, data?: any, init?: RequestInit): Promise<T> {
      const response = await retryFetch(`${baseURL}${endpoint}`, {
        ...init,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...init?.headers,
        },
        body: data ? JSON.stringify(data) : undefined,
      });
      return response.json();
    },
    
    async put<T>(endpoint: string, data?: any, init?: RequestInit): Promise<T> {
      const response = await retryFetch(`${baseURL}${endpoint}`, {
        ...init,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...init?.headers,
        },
        body: data ? JSON.stringify(data) : undefined,
      });
      return response.json();
    },
    
    async delete<T>(endpoint: string, init?: RequestInit): Promise<T> {
      const response = await retryFetch(`${baseURL}${endpoint}`, {
        ...init,
        method: 'DELETE',
      });
      return response.json();
    }
  };
}