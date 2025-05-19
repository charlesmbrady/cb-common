import { useEffect } from 'react';
import { useAuth } from './auth-context';

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithAuth(props: P) {
    const { isAuthenticated, loading, signIn } = useAuth();

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        signIn(); // Redirect to Cognito Hosted UI
      }
    }, [isAuthenticated, loading, signIn]);

    if (loading || !isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}
