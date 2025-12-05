import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import {
  AppTheme,
  AppAppBarCommon,
  Box,
  FooterMinimal,
} from '@cb-common/ui-react-mui';
import { UserProvider, useAppConfig, useUser } from '@cb-common/ui-react-auth';
import GoogleBookSearchApp from './subapps/GoogleBookSearch';
import { AppsLandingPage } from './components/AppsLandingPage';
import { navItems } from './data/navigation';

const AIChatLazy = lazy(() => import('./subapps/AIChat'));

export default function App() {
  const { data: config } = useAppConfig();
  if (!config) return null;

  return (
    <AppTheme>
      <UserProvider protectedRoutes={['/aichat']}>
        <AppShell />
      </UserProvider>
    </AppTheme>
  );
}

function AppShell() {
  const [userState, { signIn, signOut }] = useUser();
  const isAuthenticated = Boolean(userState.data);

  const handleAuthClick = () => {
    if (isAuthenticated) {
      void signOut();
    } else {
      window.sessionStorage.removeItem('redirectOnAuth');
      signIn();
    }
  };

  const handleResumeClick = () => window.open('/resume.pdf', '_blank');

  return (
    <>
      <AppAppBarCommon
        brandProps={{
          logo: (
            <Box
              sx={{
                fontWeight: 700,
                letterSpacing: 1,
                fontSize: '1.1rem',
                ':hover': { cursor: 'pointer' },
              }}
              onClick={() => (window.location.href = '/')}
            >
              Charles Brady - Apps
            </Box>
          ),
          navigationProps: {
            items: navItems,
          },
        }}
        actionsProps={{
          signInText: isAuthenticated ? 'Logout' : 'Login',
          signUpText: 'Sign Up',
          onSignInClick: handleAuthClick,
          onSignUpClick: isAuthenticated ? undefined : handleResumeClick,
          showColorMode: true,
          showSignUpButton: !isAuthenticated,
        }}
        mobileMenuProps={{
          navigationItems: navItems,
          signInText: isAuthenticated ? 'Logout' : 'Login',
          signUpText: 'Sign Up',
          onSignInClick: handleAuthClick,
          onSignUpClick: isAuthenticated ? undefined : handleResumeClick,
          showColorMode: true,
          showSignUpButton: !isAuthenticated,
        }}
      />
      <Box sx={{ pt: { xs: 8, md: 12 }, minHeight: '100vh' }}>
        <Routes>
          <Route path="/googlebooksearch/*" element={<GoogleBookSearchApp />} />
          <Route
            path="/aichat"
            element={
              <Suspense fallback={<LazyLoader label="Personal AI Assistant" />}>
                <AIChatLazy />
              </Suspense>
            }
          />
          <Route path="/" element={<AppsLandingPage />} />
        </Routes>
        <FooterMinimal
          brand={
            <Box sx={{ fontWeight: 700, letterSpacing: 1, fontSize: '1rem' }}>
              Charles Brady
            </Box>
          }
        />
      </Box>
    </>
  );
}

function LazyLoader({ label }: { label?: string }) {
  return (
    <Box
      sx={{
        minHeight: '40vh',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <CircularProgress color="primary" />
      <Box sx={{ fontWeight: 600, color: 'text.secondary' }}>
        Loading {label ?? 'experience'}...
      </Box>
    </Box>
  );
}
