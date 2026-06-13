import { Route, Routes, useLocation } from 'react-router-dom';
import { useScrollTrigger } from '@mui/material';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';
import TechnologiesPage from './pages/TechnologiesPage';
import WorkPage from './pages/WorkPage';
import ContactPage from './pages/ContactPage';

import {
  AppTheme,
  AppAppBarCommon,
  AppBarNavigationItem,
  Box,
  FooterMinimal,
} from '@cb-common/ui-react-mui';
import { socialLinks } from './data/socialLinks';
import { portfolioTheme } from './theme';
import { Backdrop3D } from './components/Backdrop3D';

const navItems: AppBarNavigationItem[] = [
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Technologies', href: '/technologies' },
  { label: 'Work', href: '/work' },
  { label: 'Contact', href: '/contact' },
];

export default function App() {
  const { pathname } = useLocation();
  const pastHero = useScrollTrigger({
    disableHysteresis: true,
    threshold: typeof window !== 'undefined' ? window.innerHeight * 0.5 : 440,
  });
  // The hero already introduces the name, so on the homepage the navbar
  // stays out of the way until the visitor scrolls past it.
  const showNav = pathname !== '/' || pastHero;

  return (
    <AppTheme theme={portfolioTheme}>
      <Backdrop3D />
      <Box
        sx={{
          '& .MuiAppBar-root': {
            transition:
              'transform 0.4s ease, opacity 0.4s ease, visibility 0.4s',
            transform: showNav ? 'none' : 'translateY(-130%)',
            opacity: showNav ? 1 : 0,
            visibility: showNav ? 'visible' : 'hidden',
          },
        }}
      >
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
                Charles Brady
              </Box>
            ),
            navigationProps: {
              items: navItems.map(({ label, href }) => ({ label, href })),
            },
          }}
          actionsProps={{
            signInText: 'GitHub',
            signUpText: 'Resume',
            onSignInClick: () =>
              window.open('https://github.com/charlesmbrady', '_blank'),
            onSignUpClick: () => window.open('/resume.pdf', '_blank'),
            showColorMode: true,
          }}
          mobileMenuProps={{
            navigationItems: navItems.map(({ label, href }) => ({
              label,
              href,
            })),
            signInText: 'GitHub',
            signUpText: 'Resume',
            onSignInClick: () =>
              window.open('https://github.com/charlesmbrady', '_blank'),
            onSignUpClick: () => window.open('/resume.pdf', '_blank'),
            showColorMode: true,
          }}
        />
      </Box>
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          pt: { xs: 13, md: 14 },
          minHeight: '100vh',
        }}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/technologies" element={<TechnologiesPage />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
        <FooterMinimal
          brand={
            <Box sx={{ fontWeight: 700, letterSpacing: 1, fontSize: '1rem' }}>
              Charles Brady
            </Box>
          }
          socialLinksProps={{
            links: socialLinks,
          }}
        />
      </Box>
    </AppTheme>
  );
}
