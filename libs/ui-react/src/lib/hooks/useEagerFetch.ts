import { useEffect, useState } from 'react';
import { useAppConfig, useUser } from '../contexts';

const cache = new Map<string, unknown>();

export function useEagerFetch<T>(path?: string | null, requiresAuth = true, shouldCache = true) {
  const appConfig = useAppConfig();
  const [, { getAuthToken }] = useUser();

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData(atPath: string) {
      setData(null);
      setIsLoading(true);
      setError(null);

      try {
        const headers: Record<string, string> = {
          'content-type': 'application/json',
        };
        if (requiresAuth) {
          const authToken = await getAuthToken();
          headers['authorization'] = `Bearer ${authToken}`;
        }

        const response = await fetch(atPath, {
          headers,
        });
        if (response.status >= 400) {
          throw new Error(`Failed request, status=${response.status}`);
        }

        const responseData: T = await response.json();
        cache.set(atPath, responseData);
        setData(responseData);
      } catch (err) {
        console.error('Failed to fetch data', err);
        setError('Something went wrong, please try again');
      } finally {
        setIsLoading(false);
      }
    }

    if (appConfig?.data?.apiUrl && path) {
      const url = `${appConfig.data.apiUrl}${path}`;
      const cachedData = cache.get(url);
      if (cachedData && shouldCache) {
        setData(cachedData as T);
      } else {
        fetchData(url);
      }
    }
  }, [appConfig, path, requiresAuth, getAuthToken, shouldCache]);

  return {
    isLoading,
    data,
    error,
  };
}

export default useEagerFetch;
