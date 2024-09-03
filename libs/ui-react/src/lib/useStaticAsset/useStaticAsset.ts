import { useEffect, useState } from 'react';

const cache = new Map<string, unknown>();

export function useStaticAsset<T>(path?: string | null) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData(atPath: string) {
      setData(null);
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(atPath);
        if (response.status !== 200) {
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

    if (path) {
      const cachedData = cache.get(path);
      if (cachedData) {
        setData(cachedData as T);
      } else {
        fetchData(path);
      }
    }
  }, [path]);

  return {
    isLoading,
    data,
    error,
  };
}

export default useStaticAsset;
