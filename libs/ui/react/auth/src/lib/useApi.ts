import { useState, useEffect, useCallback } from 'react';
import { useUser } from './UserProvider';
import { useAppConfig } from './AppConfigProvider';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiRequestOptions<TBody = any> {
  method?: HttpMethod;
  body?: TBody;
  headers?: Record<string, string>;
  queryParams?: Record<string, string | number | boolean>;
}

export interface ApiError {
  message: string;
  status?: number;
  data?: any;
}

export interface UseApiFetchResult<TData> {
  data: TData | null;
  error: ApiError | null;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

export interface UseApiLazyResult<TData, TBody = any> {
  data: TData | null;
  error: ApiError | null;
  isLoading: boolean;
  execute: (options?: ApiRequestOptions<TBody>) => Promise<TData>;
  reset: () => void;
}

/**
 * Core function to build a full URL from endpoint path and query params
 */
function buildUrl(
  baseUrl: string,
  endpoint: string,
  queryParams?: Record<string, string | number | boolean>
): string {
  // Ensure baseUrl ends without trailing slash and endpoint starts without leading slash
  const base = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const path = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  // Build full URL by concatenating base + path
  const fullUrl = `${base}/${path}`;
  const url = new URL(fullUrl);
  
  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }
  return url.toString();
}

/**
 * Core function to make an authenticated API request
 */
async function makeAuthenticatedRequest<TData, TBody = any>(
  url: string,
  getAuthToken: () => Promise<string | null>,
  options: ApiRequestOptions<TBody> = {}
): Promise<TData> {
  const { method = 'GET', body, headers = {} } = options;

  // Get auth token
  const token = await getAuthToken();
  if (!token) {
    throw {
      message: 'No authentication token available',
      status: 401,
    } as ApiError;
  }

  // Prepare headers
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    ...headers,
  };

  // Prepare request init
  const requestInit: RequestInit = {
    method,
    headers: requestHeaders,
  };

  // Add body for non-GET requests
  if (body && method !== 'GET') {
    requestInit.body = JSON.stringify(body);
  }

  // Make request
  const response = await fetch(url, requestInit);

  // Handle errors
  if (!response.ok) {
    let errorData: any;
    try {
      errorData = await response.json();
    } catch {
      errorData = await response.text();
    }

    throw {
      message: `Request failed with status ${response.status}`,
      status: response.status,
      data: errorData,
    } as ApiError;
  }

  // Parse response
  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    return await response.json();
  }

  // Return text for non-JSON responses
  return (await response.text()) as unknown as TData;
}

/**
 * Hook for eager API fetching (fetches on mount and when dependencies change)
 *
 * @param endpoint - API endpoint path (e.g., '/services/agentcore/invoke')
 * @param options - Request options including method, body, headers, queryParams
 * @param deps - Dependency array to trigger refetch
 *
 * @example
 * const { data, error, isLoading, refetch } = useApiFetch<User[]>('/users');
 *
 * @example
 * const { data, error, isLoading } = useApiFetch<AgentResponse>(
 *   '/services/agentcore/invoke',
 *   { method: 'POST', body: { prompt: 'Hello' } },
 *   [prompt]
 * );
 */
export function useApiFetch<TData, TBody = any>(
  endpoint: string,
  options: ApiRequestOptions<TBody> = {},
  deps: any[] = []
): UseApiFetchResult<TData> {
  const [data, setData] = useState<TData | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [, userActions] = useUser();
  const { data: appConfig } = useAppConfig();

  const fetchData = useCallback(async () => {
    if (!appConfig?.apiUrl) {
      setError({ message: 'API configuration not loaded' });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const url = buildUrl(appConfig.apiUrl, endpoint, options.queryParams);
      const result = await makeAuthenticatedRequest<TData, TBody>(
        url,
        userActions.getAuthToken,
        options
      );
      setData(result);
    } catch (err) {
      setError(
        (err as ApiError) || { message: 'An unexpected error occurred' }
      );
    } finally {
      setIsLoading(false);
    }
  }, [appConfig?.apiUrl, endpoint, userActions.getAuthToken, ...deps]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    error,
    isLoading,
    refetch: fetchData,
  };
}

/**
 * Hook for lazy API fetching (only fetches when execute is called)
 *
 * @param endpoint - API endpoint path (e.g., '/services/agentcore/invoke')
 * @param defaultOptions - Default request options (can be overridden in execute)
 *
 * @example
 * const { data, error, isLoading, execute } = useApiLazy<AgentResponse, { prompt: string }>(
 *   '/services/agentcore/invoke',
 *   { method: 'POST' }
 * );
 *
 * const handleSubmit = async () => {
 *   const result = await execute({ body: { prompt: 'Hello' } });
 * };
 *
 * @example
 * const { execute } = useApiLazy<User>('/users', { method: 'GET' });
 * const user = await execute({ queryParams: { id: '123' } });
 */
export function useApiLazy<TData, TBody = any>(
  endpoint: string,
  defaultOptions: ApiRequestOptions<TBody> = {}
): UseApiLazyResult<TData, TBody> {
  const [data, setData] = useState<TData | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [, userActions] = useUser();
  const { data: appConfig } = useAppConfig();

  const execute = useCallback(
    async (overrideOptions: ApiRequestOptions<TBody> = {}): Promise<TData> => {
      if (!appConfig?.apiUrl) {
        const error = { message: 'API configuration not loaded' };
        setError(error);
        throw error;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Merge default options with override options
        const mergedOptions: ApiRequestOptions<TBody> = {
          ...defaultOptions,
          ...overrideOptions,
          headers: {
            ...defaultOptions.headers,
            ...overrideOptions.headers,
          },
          queryParams: {
            ...defaultOptions.queryParams,
            ...overrideOptions.queryParams,
          },
        };

        const url = buildUrl(
          appConfig.apiUrl,
          endpoint,
          mergedOptions.queryParams
        );
        const result = await makeAuthenticatedRequest<TData, TBody>(
          url,
          userActions.getAuthToken,
          mergedOptions
        );
        setData(result);
        return result;
      } catch (err) {
        const apiError = (err as ApiError) || {
          message: 'An unexpected error occurred',
        };
        setError(apiError);
        throw apiError;
      } finally {
        setIsLoading(false);
      }
    },
    [appConfig?.apiUrl, endpoint, defaultOptions, userActions.getAuthToken]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    data,
    error,
    isLoading,
    execute,
    reset,
  };
}
