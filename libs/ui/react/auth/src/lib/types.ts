import { AuthProviderProps as OIDCAuthProviderProps } from 'react-oidc-context';

export interface CognitoAuthConfig {
  authority: string;
  client_id: string;
  redirect_uri: string;
  response_type: 'code';
  scope: string;
  logout_uri?: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  error: Error | null;
}

export interface AuthProviderProps
  extends Omit<
    OIDCAuthProviderProps,
    'authority' | 'client_id' | 'redirect_uri' | 'response_type' | 'scope'
  > {
  config: CognitoAuthConfig;
}
