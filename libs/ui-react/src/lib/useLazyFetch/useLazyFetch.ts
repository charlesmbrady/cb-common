import { useMemo, useState } from 'react';

export function useLazyFetch<T>(path?: string | null) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useMemo(
    () => async (init?: Omit<RequestInit, 'body'> & { body?: Record<string, unknown> }) => {
      try {
        if (!path) {
          throw new Error('Fetch path has not been defined');
        }

        setError(null);
        setIsLoading(true);

        const response = await fetch(path, {
          mode: 'cors',
          cache: 'no-cache',
          ...init,
          body: init?.body ? JSON.stringify(init.body) : undefined,
        });
        if (response.status !== 200) {
          throw new Error(`Failed request, status=${response.status}`);
        }

        const data: T = await response.json();
        return data;
      } catch (err) {
        console.error('Failed to fetch', err);
        setError('Failed to execute request');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [path]
  );

  return [execute, isLoading, error] as const;
}

export default useLazyFetch;
