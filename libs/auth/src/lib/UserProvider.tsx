import { Amplify, Auth } from 'aws-amplify';
import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useMemo,
} from 'react';
import { AppConfig, useAppConfig } from './AppConfigProvider';
import { useLocation, useNavigate } from 'react-router-dom';

// Placeholder for roles and loader
export type UserRole = string;
const hasInternalRole = (roles: UserRole[]) => roles.includes('admin');

// User types
export type User = {
  id: string;
  email: string;
  phoneNumber?: string;
  firstName: string;
  lastName: string;
  roles: UserRole[];
  isInternal: boolean;
};

type State = {
  data: User | null;
  isLoading: boolean;
  error?: string | null;
};

type Action = { type: 'setUser'; payload: User } | { type: 'clearUser' };
type Dispatch = (action: Action) => void;
type UserProviderProps = {
  children: React.ReactNode;
  protectedRoutes?: string[];
};

const UserContext = createContext<
  | {
      state: State;
      dispatch: Dispatch;
    }
  | undefined
>(undefined);

const REDIRECT_ON_AUTH_KEY = 'redirectOnAuth';

function UserReducer(state: State, action: Action) {
  switch (action.type) {
    case 'setUser': {
      return { data: { ...action.payload }, isLoading: false };
    }
    case 'clearUser': {
      return { data: null, isLoading: false };
    }
    default: {
      throw new Error('Unhandled action');
    }
  }
}

export function UserProvider({
  children,
  protectedRoutes = [],
}: UserProviderProps): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: appConfig, isLoading: configLoading } = useAppConfig();
  const [state, dispatch] = useReducer(UserReducer, {
    data: null,
    isLoading: true,
  });
  const value = { state, dispatch };

  useEffect(() => {
    if (configLoading || !appConfig) return; // Wait for config to load
    let active = true;
    async function checkSession() {
      try {
        if (!appConfig) return;
        configureAws(appConfig);
        const user = await Auth.currentAuthenticatedUser();
        const session = await Auth.currentSession();
        const attributesArray = await Auth.userAttributes(user);
        const attributes: Record<string, string> = {};
        attributesArray.forEach((attr) => {
          attributes[attr.Name] = attr.Value;
        });
        if (active) {
          const idTokenPayload = session.getIdToken().decodePayload() as Record<
            string,
            any
          >;
          const rolesRaw = idTokenPayload.roles;
          const roles =
            typeof rolesRaw === 'string'
              ? (rolesRaw.split(',') as UserRole[])
              : [];
          dispatch({
            type: 'setUser',
            payload: {
              id:
                typeof attributes['custom:ssoUserId'] === 'string'
                  ? attributes['custom:ssoUserId']
                  : user.username,
              email:
                typeof attributes.email === 'string' ? attributes.email : '',
              phoneNumber:
                typeof attributes.phone_number === 'string'
                  ? attributes.phone_number
                  : undefined,
              firstName:
                typeof idTokenPayload.firstName === 'string'
                  ? idTokenPayload.firstName
                  : '',
              lastName:
                typeof idTokenPayload.lastName === 'string'
                  ? idTokenPayload.lastName
                  : '',
              roles,
              isInternal: hasInternalRole(roles),
            },
          });

          // Remove code/id_token from URL after successful login
          if (
            window.location.search.includes('code=') ||
            window.location.search.includes('id_token=')
          ) {
            const url = new URL(window.location.href);
            url.search = '';
            window.history.replaceState({}, document.title, url.toString());
          }

          const redirectRoute =
            window.sessionStorage.getItem(REDIRECT_ON_AUTH_KEY);
          if (redirectRoute && redirectRoute !== '/') {
            window.sessionStorage.removeItem(REDIRECT_ON_AUTH_KEY);
            navigate(redirectRoute, { replace: true });
          }
        }
      } catch (err: any) {
        console.error('failed getting authenticated user', err);

        // Only redirect if the error is a real auth error
        const isAuthError =
          err &&
          ((typeof err === 'string' &&
            (err.toLowerCase().includes('not authenticated') ||
              err.toLowerCase().includes('no current user'))) ||
            (err.message &&
              (err.message.toLowerCase().includes('not authenticated') ||
                err.message.toLowerCase().includes('no current user'))));

        // If we're on the callback URL (look for ?code= or ?id_token=), don't redirect again
        const params = new URLSearchParams(window.location.search);
        const isCallback = params.has('code') || params.has('id_token');

        // Hybrid: Only redirect if current route is protected
        const isProtected = protectedRoutes.some((route) =>
          location.pathname.startsWith(route)
        );

        if (isAuthError && !isCallback && isProtected) {
          window.sessionStorage.setItem(
            REDIRECT_ON_AUTH_KEY,
            location.pathname
          );
          Auth.federatedSignIn();
        } else {
          // For public routes, just clear user and do not redirect
          dispatch({ type: 'clearUser' });
        }
      }
    }
    checkSession();
    return () => {
      active = false;
    };
  }, [dispatch, appConfig, configLoading, navigate, location, protectedRoutes]);

  if (configLoading || !appConfig) {
    return <div>Loading...</div>;
  }

  const isProtected = protectedRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  return (
    <UserContext.Provider value={value}>
      {isProtected ? state.data ? children : <div>Loading...</div> : children}
    </UserContext.Provider>
  );
}

function configureAws(appConfig: AppConfig) {
  console.log('Configuring Amplify with:', appConfig);
  const awsConfig = {
    Auth: {
      mandatorySignIn: false,
      region: 'us-east-1',
      userPoolId: appConfig.userPoolId,
      userPoolWebClientId: appConfig.userPoolWebClientId,
      cookieStorage: {
        domain: window.location.hostname,
        secure: window.location.hostname !== 'localhost',
        path: '/',
        expires: 1,
      },
      oauth: {
        domain: appConfig.oauthDomain,
        scope: ['aws.cognito.signin.user.admin', 'profile', 'email', 'openid'],
        redirectSignIn: `http://localhost:3000`,
        redirectSignOut: `http://localhost:3000`,
        responseType: 'code',
      },
    },
  };
  Amplify.configure(awsConfig as any);
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within an UserProvider');
  }
  return useMemo(
    () =>
      [
        context.state,
        {
          signIn: () => {
            Auth.federatedSignIn();
          },
          signOut: async () => {
            context.dispatch({ type: 'clearUser' });
            await Auth.signOut();
          },
          getAuthToken: async (): Promise<string | null> => {
            try {
              const session = await Auth.currentSession();
              return session.getIdToken().getJwtToken() || null;
            } catch (err) {
              console.error('Failed to get auth token', err);
              return null;
            }
          },
          getDecodedIdToken: async (): Promise<Record<string, any> | null> => {
            try {
              const session = await Auth.currentSession();
              return session.getIdToken().decodePayload() || null;
            } catch (err) {
              console.error('Failed to decode id token', err);
              return null;
            }
          },
        },
      ] as const,
    [context]
  );
}
