import { QueryClient, QueryFunction, MutationCache, QueryCache } from "@tanstack/react-query";

interface ApiError {
  status: number;
  message: string;
  details?: any;
}

class NetworkError extends Error {
  public status: number;
  public details?: any;
  
  constructor(status: number, message: string, details?: any) {
    super(message);
    this.name = 'NetworkError';
    this.status = status;
    this.details = details;
  }
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let errorMessage = res.statusText;
    let errorDetails;
    
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
      errorDetails = errorData;
    } catch {
      // If response is not JSON, use text
      try {
        errorMessage = (await res.text()) || errorMessage;
      } catch {
        // Fallback to status text
      }
    }
    
    throw new NetworkError(res.status, errorMessage, errorDetails);
  }
}

// Exponential backoff retry delay function
function getRetryDelay(attemptIndex: number): number {
  return Math.min(1000 * (2 ** attemptIndex), 30000); // Cap at 30 seconds
}

// Check if error should trigger retry
function shouldRetry(error: any, failureCount: number): boolean {
  // Don't retry client errors (4xx) except 408, 429
  if (error instanceof NetworkError) {
    if (error.status >= 400 && error.status < 500) {
      return error.status === 408 || error.status === 429;
    }
    // Retry server errors (5xx) and network issues
    return error.status >= 500 || error.status === 0;
  }
  
  // Don't retry more than 3 times
  return failureCount < 3;
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
  options: { timeout?: number; signal?: AbortSignal } = {},
): Promise<Response> {
  const { timeout = 30000, signal } = options;
  
  // Create abort controller for timeout if no signal provided
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  // Use provided signal or our timeout signal
  const finalSignal = signal || controller.signal;
  
  try {
    const res = await fetch(url, {
      method,
      headers: data ? { "Content-Type": "application/json" } : {},
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
      signal: finalSignal,
    });

    await throwIfResNotOk(res);
    return res;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new NetworkError(0, 'Request timeout', { timeout });
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";

interface QueryFnOptions {
  on401: UnauthorizedBehavior;
  timeout?: number;
}

export const getQueryFn = <T = unknown>(options: QueryFnOptions): QueryFunction<T> =>
  async ({ queryKey, signal }) => {
    const { on401: unauthorizedBehavior, timeout = 15000 } = options;
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    // Combine signals
    const combinedSignal = signal || controller.signal;
    
    try {
      const res = await fetch(queryKey.join("/") as string, {
        credentials: "include",
        signal: combinedSignal,
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      return await res.json();
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new NetworkError(0, 'Query timeout', { timeout });
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  };

// Create query cache with error handling
const queryCache = new QueryCache({
  onError: (error) => {
    console.error('Query error:', error);
    // You could add global error handling here, like showing toasts
  },
});

// Create mutation cache with error handling
const mutationCache = new MutationCache({
  onError: (error) => {
    console.error('Mutation error:', error);
  },
});

export const queryClient = new QueryClient({
  queryCache,
  mutationCache,
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw", timeout: 15000 }),
      // Smart stale time based on data freshness needs
      staleTime: 5 * 60 * 1000, // 5 minutes for most data
      // Cache time - how long to keep data in cache when not being observed
      gcTime: 30 * 60 * 1000, // 30 minutes (was cacheTime in v4)
      // Retry configuration with exponential backoff
      retry: (failureCount, error) => shouldRetry(error, failureCount),
      retryDelay: getRetryDelay,
      // Background refetching
      refetchOnWindowFocus: true, // Refetch when user returns to tab
      refetchOnReconnect: true, // Refetch when network reconnects
      refetchOnMount: true, // Refetch when component mounts
      // Network mode configuration
      networkMode: 'online', // Only run queries when online
      // Deduplication
      structuralSharing: true, // Enable structural sharing for better performance
    },
    mutations: {
      // Retry mutations more conservatively
      retry: (failureCount, error) => {
        // Only retry network errors, not client errors
        if (error instanceof NetworkError && error.status >= 500) {
          return failureCount < 2;
        }
        return false;
      },
      retryDelay: getRetryDelay,
      networkMode: 'online',
    },
  },
});

// Helper functions to create query keys with better structure and typing
export const createQueryKey = {
  // Analysis-related queries
  analysis: (id?: string): readonly [string] | readonly [string, string] => 
    id ? ['/api/analyses', id] : ['/api/analyses'] as const,
  
  // Sample code queries
  sample: (algorithm: string, language: string): readonly [string, string, { language: string }] => 
    ['/api/samples', algorithm, { language }] as const,
  
  // Generic API query key builder
  api: <T extends Record<string, any> = Record<string, any>>(endpoint: string, params?: T): readonly [string] | readonly [string, T] => 
    params ? [endpoint, params] : [endpoint] as const,
} as const;

// Cache management utilities
export const cacheUtils = {
  // Invalidate all analysis-related queries
  invalidateAnalyses: () => {
    return queryClient.invalidateQueries({ 
      queryKey: ['/api/analyses'],
      exact: false // Invalidate all analysis queries
    });
  },
  
  // Remove specific analysis from cache
  removeAnalysis: (id: string) => {
    return queryClient.removeQueries({ 
      queryKey: ['/api/analyses', id],
      exact: true
    });
  },
  
  // Prefetch analysis data
  prefetchAnalysis: (id: string) => {
    return queryClient.prefetchQuery({
      queryKey: createQueryKey.analysis(id),
      staleTime: 10 * 60 * 1000, // 10 minutes for analysis data
    });
  },
  
  // Clear all cache
  clearAll: () => {
    queryClient.clear();
  },
};