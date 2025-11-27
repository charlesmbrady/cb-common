import { useCallback } from 'react';
import { useUser } from './UserProvider';

export interface AuthApiRequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

export interface UseAuthApiRequestReturn {
  authApiRequest: (
    url: string,
    options?: AuthApiRequestOptions
  ) => Promise<Response>;
  isAuthenticated: boolean;
}

/**
 * Custom hook for making authenticated API requests
 * Automatically includes the ID token in the Authorization header
 */
export function useAuthApiRequest(): UseAuthApiRequestReturn {
  const [userState, userActions] = useUser();
  const isAuthenticated = !!userState.data;

  const authApiRequest = useCallback(
    async (
      url: string,
      options: AuthApiRequestOptions = {}
    ): Promise<Response> => {
      try {
        // Get the current ID token
        const idToken = await userActions.getAuthToken();

        if (!idToken) {
          throw new Error('No authentication token available');
        }

        // Prepare headers with authentication
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
          ...options.headers,
        };

        // Make the authenticated request
        const response = await fetch(url, {
          ...options,
          headers,
        });

        return response;
      } catch (error) {
        console.error('Auth API request failed:', error);
        throw error;
      }
    },
    [userActions]
  );

  return {
    authApiRequest,
    isAuthenticated,
  };
}

export default useAuthApiRequest;
