import { createContext, useContext } from 'react';
import {
  AuthProvider as OIDCAuthProvider,
  useAuth as useOIDCAuth,
} from 'react-oidc-context';
import { AuthContextType, AuthProviderProps } from './types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  config,
  ...props
}: AuthProviderProps) {
  const {
    authority,
    client_id,
    redirect_uri,
    response_type,
    scope,
    logout_uri,
  } = config;

  return (
    <OIDCAuthProvider
      authority={authority}
      client_id={client_id}
      redirect_uri={redirect_uri}
      response_type={response_type}
      scope={scope}
      {...props}
    >
      <AuthContextProvider>{children}</AuthContextProvider>
    </OIDCAuthProvider>
  );
}

function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const auth = useOIDCAuth();

  const handleSignOut = async () => {
    if (auth.user) {
      const clientId = auth.user.profile.aud as string;
      const logoutUri =
        (auth.settings as any)?.logout_uri || auth.settings.redirect_uri;
      const cognitoDomain = auth.settings.authority;
      window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
        logoutUri
      )}`;
    }
  };

  const value: AuthContextType = {
    isAuthenticated: auth.isAuthenticated,
    user: auth.user,
    loading: auth.isLoading,
    signIn: auth.signinRedirect,
    signOut: handleSignOut,
    error: auth.error || null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
