import { Route, Routes } from 'react-router-dom';
import { Link, RouterLink } from '@cb-common/ui-react-mui';
import {
  AppConfigProvider,
  UserProvider,
  useAppConfig,
} from '@cb-common/ui-react-auth';
import GoogleBookSearchApp from './subapps/GoogleBookSearch';
import AIChat from './subapps/AIChat';
// ScrapeNSurf removed

import {
  AppTheme,
  AppAppBarCommon,
  AppBarNavigationItem,
  Box,
  FooterMinimal,
} from '@cb-common/ui-react-mui';

// const navItems: AppBarNavigationItem[] = [
//   { label: 'About', href: '/about' },
//   { label: 'Projects', href: '/projects' },
//   { label: 'Technologies', href: '/technologies' },
//   { label: 'Work', href: '/work' },
//   { label: 'Contact', href: '/contact' },
// ];

// const HomePage = lazy(() => import('./pages/HomePage'));
// const AboutPage = lazy(() => import('./pages/AboutPage'));
// const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
// const TechnologiesPage = lazy(() => import('./pages/TechnologiesPage'));
// const WorkPage = lazy(() => import('./pages/WorkPage'));
// const ContactPage = lazy(() => import('./pages/ContactPage'));

export default function App() {
  const { data: config, isLoading } = useAppConfig();
  if (!config) return null;

  return (
    <AppTheme>
      <UserProvider protectedRoutes={['/aichat']}>
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
              // items: navItems.map(({ label, href }) => ({ label, href })),
            },
          }}
          actionsProps={{
            signInText: 'Github',
            signUpText: 'Portfolio Home',
            onSignInClick: () => console.log('Sign In Clicked'), //TODO: change to github link
            onSignUpClick: () => console.log('Sign Up Clicked'), //TODO: change to portfolio home link
            showColorMode: true,
          }}
          mobileMenuProps={{
            // navigationItems: navItems.map(({ label, href }) => ({
            //   label,
            //   href,
            // })),
            signInText: 'GitHub',
            signUpText: 'Portfolio Home',
            onSignInClick: () => console.log('Sign In Clicked'), //TODO: change to github link
            onSignUpClick: () => console.log('Sign Up Clicked'), //TODO: change to portfolio home link
            showColorMode: true,
          }}
        />
        <Box sx={{ pt: { xs: 8, md: 12 }, minHeight: '100vh' }}>
          <Routes>
            <Route
              path="/googlebooksearch/*"
              element={<GoogleBookSearchApp />}
            />
            <Route path="/aichat" element={<AIChat />} />
            <Route
              path="/"
              element={
                <Box sx={{ px: 2, py: 3 }}>
                  <Box sx={{ fontSize: '1.1rem', fontWeight: 600, mb: 1 }}>
                    Apps
                  </Box>
                  <Box>
                    <RouterLink to="/aichat">AI Assistant Chat</RouterLink>
                  </Box>
                  <Box sx={{ mt: 1 }}>
                    <RouterLink to="/googlebooksearch">
                      Google Book Search
                    </RouterLink>
                  </Box>
                  <Box sx={{ mt: 1 }}>
                    <a href="/subapps/GifTastic/index.html">
                      GifTastic (vanilla)
                    </a>
                  </Box>
                  <Box sx={{ mt: 1 }}>
                    <a href="/subapps/ThePsychicGame/index.html">
                      The Psychic Game (vanilla)
                    </a>
                  </Box>
                  <Box sx={{ mt: 1 }}>
                    <a href="/subapps/TriviaGame/index.html">
                      Trivia Game (vanilla)
                    </a>
                  </Box>
                  <Box sx={{ mt: 1 }}>
                    <a href="/subapps/WordGuessGame/index.html">
                      Word Guess Game (vanilla)
                    </a>
                  </Box>
                  <Box sx={{ mt: 1 }}>
                    <a href="/subapps/StarWarsGame/index.html">
                      Star Wars RPG (vanilla)
                    </a>
                  </Box>
                  <Box sx={{ mt: 1 }}>
                    <a href="/subapps/FormValidator/index.html">
                      Form Validator (vanilla)
                    </a>
                  </Box>
                  <Box sx={{ mt: 1 }}>
                    <a href="/subapps/MovieSeatBooking/index.html">
                      Movie Seat Booking (vanilla)
                    </a>
                  </Box>
                </Box>
              }
            />
          </Routes>
          <FooterMinimal
            brand={
              <Box sx={{ fontWeight: 700, letterSpacing: 1, fontSize: '1rem' }}>
                Charles Brady
              </Box>
            }
            // socialLinksProps={{
            //   links: socialLinks,
            // }}
          />
        </Box>
      </UserProvider>
    </AppTheme>
  );
}
