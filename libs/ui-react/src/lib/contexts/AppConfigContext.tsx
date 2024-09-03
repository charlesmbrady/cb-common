// modeled on https://kentcdodds.com/blog/how-to-use-react-context-effectively
import { createContext, useContext, useEffect, useReducer } from 'react';

import { UserRole } from '@cb-common/data';

import { FullScreenLoader } from '../FullScreenLoader/FullScreenLoader';

type State = {
  data: AppConfig | null;
  isLoading: boolean;
  error?: string | null;
};

export type AppConfig = {
  apiDomain: string;
  apiUrl: string;
  authorizedRoles: UserRole[];
  domain: string;
  environment: string;
  oauthDomain: string;
  redirectSignOut: string;
  userPoolId: string;
  userPoolWebClientId: string;
  streamClientApiKey: string | null;
  phsUrl?: string;
  websiteUrl?: string;
  memberProfileUrl?: string;
};

type Action =
  | { type: 'fetchAppConfigRequest' }
  | { type: 'fetchAppConfigSuccess'; payload: AppConfig }
  | { type: 'fetchAppConfigFailure' };

type Dispatch = (action: Action) => void;
type AppConfigProviderProps = { children: React.ReactNode };

const AppConfigContext = createContext<
  | {
      state: State;
      dispatch: Dispatch;
    }
  | undefined
>(undefined);

function appConfigReducer(state: State, action: Action) {
  switch (action.type) {
    case 'fetchAppConfigRequest': {
      return { ...state, isLoading: true };
    }
    case 'fetchAppConfigSuccess': {
      return { data: { ...action.payload }, isLoading: false };
    }
    case 'fetchAppConfigFailure': {
      return {
        ...state,
        isLoading: false,
        error: 'Failed to load configuration',
      };
    }
    default: {
      throw new Error('Unhandled action');
    }
  }
}

function AppConfigProvider({ children }: AppConfigProviderProps): JSX.Element {
  const [state, dispatch] = useReducer(appConfigReducer, {
    data: null,
    isLoading: false,
  });
  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  const value = { state, dispatch };

  useEffect(() => {
    let active = true;

    async function fetchConfig() {
      try {
        dispatch({ type: 'fetchAppConfigRequest' });
        const response = await fetch('/config.json');
        if (response.status !== 200) {
          throw new Error(`Failed request, status=${response.status}`);
        }

        if (active) {
          const json = await response.json();
          const protocol = json.apiDomain.startsWith('localhost') ? 'http' : 'https';
          const config: AppConfig = {
            ...json,
            apiUrl: `${protocol}://${json.apiDomain}`,
          };
          dispatch({ type: 'fetchAppConfigSuccess', payload: config });
        }
      } catch (err) {
        console.error('Failed to fetch app config', err);
        dispatch({ type: 'fetchAppConfigFailure' });
      }
    }

    fetchConfig();

    return () => {
      active = false;
    };
  }, [dispatch]);

  return (
    <AppConfigContext.Provider value={value}>
      {state.data ? children : <FullScreenLoader open />}
    </AppConfigContext.Provider>
  );
}

function useAppConfig() {
  const context = useContext(AppConfigContext);
  if (context === undefined) {
    throw new Error('useAppConfig must be used within an AppConfigProvider');
  }
  return context.state;
}

export { AppConfigProvider, useAppConfig };
