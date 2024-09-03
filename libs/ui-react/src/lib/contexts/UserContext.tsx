// modeled on https://kentcdodds.com/blog/how-to-use-react-context-effectively
import { Amplify, Auth } from 'aws-amplify';
import { createContext, useContext, useEffect, useReducer, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { hasInternalRole, UserRole } from '@cb-common/data';

import { FullScreenLoader } from '../FullScreenLoader/FullScreenLoader';
import { AppConfig, useAppConfig } from './AppConfigContext';

type State = {
  data: User | null;
  isLoading: boolean;
  error?: string | null;
};

type User = {
  id: string;
  email: string;
  phoneNumber?: string;
  firstName: string;
  lastName: string;
  roles: UserRole[];
  isInternal: boolean;
};

type Action = { type: 'setUser'; payload: User } | { type: 'clearUser' };

type Dispatch = (action: Action) => void;
type UserProviderProps = { children: React.ReactNode };

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

function UserProvider({ children }: UserProviderProps): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();

  const { data: appConfig } = useAppConfig();
  const [state, dispatch] = useReducer(UserReducer, {
    data: null,
    isLoading: true, // need to get user on load
  });
  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  const value = { state, dispatch };

  useEffect(() => {
    let active = true;

    async function checkSession() {
      if (!appConfig) {
        return;
      }

      try {
        configureAws(appConfig);

        const user = await Auth.currentAuthenticatedUser();

        if (active) {
          const decodedIdToken = (await Auth.currentSession()).getIdToken().decodePayload() as {
            roles: string;
            firstName: string;
            lastName: string;
          };

          const roles = decodedIdToken.roles.split(',') as UserRole[];
          dispatch({
            type: 'setUser',
            payload: {
              id: user.attributes['custom:ssoUserId'],
              email: user.attributes.email,
              phoneNumber: user.attributes.phone_number,
              firstName: decodedIdToken.firstName,
              lastName: decodedIdToken.lastName,
              roles,
              isInternal: hasInternalRole(roles),
            },
          });

          const redirectRoute = window.sessionStorage.getItem(REDIRECT_ON_AUTH_KEY);
          if (redirectRoute && redirectRoute !== '/') {
            window.sessionStorage.removeItem(REDIRECT_ON_AUTH_KEY);
            navigate(redirectRoute, { replace: true });
          }
        }
      } catch (err) {
        console.error('failed getting authenticated user');
        if (location.pathname !== '/') {
          window.sessionStorage.setItem(REDIRECT_ON_AUTH_KEY, location.pathname);
        }
        Auth.federatedSignIn();
      }
    }

    checkSession();

    return () => {
      active = false;
    };
  }, [dispatch, appConfig, navigate, location]);

  return (
    <UserContext.Provider value={value}>
      {state.data ? children : <FullScreenLoader open transparent={false} />}
    </UserContext.Provider>
  );
}

function configureAws(appConfig: AppConfig) {
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
        scope: ['aws.cognito.signin.user.admin', 'openid'],
        redirectSignIn: `${window.location.origin}/`,
        redirectSignOut: `${window.location.origin}/`,
        responseType: 'code',
      },
    },
  };

  Amplify.configure(awsConfig);
}

function useUser() {
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
          signOut: () => {
            context.dispatch({ type: 'clearUser' });
            Auth.signOut();
          },
          getAuthToken: async (): Promise<string | null> => {
            try {
              return (await Auth.currentSession()).getIdToken().getJwtToken();
            } catch (err) {
              console.error('Failed to get auth token', err);
              return null;
            }
          },
          getDecodedIdToken: async (): Promise<Record<string, string> | null> => {
            try {
              return (await Auth.currentSession()).getIdToken().decodePayload();
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

export { UserProvider, useUser };
