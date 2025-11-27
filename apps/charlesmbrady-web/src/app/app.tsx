// Uncomment this line to use CSS modules
// import styles from './app.module.css';
// import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Link, RouterLink } from '@cb-common/ui-react-mui';
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

const navItems: AppBarNavigationItem[] = [
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Technologies', href: '/technologies' },
  { label: 'Work', href: '/work' },
  { label: 'Contact', href: '/contact' },
];

// const HomePage = lazy(() => import('./pages/HomePage'));
// const AboutPage = lazy(() => import('./pages/AboutPage'));
// const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
// const TechnologiesPage = lazy(() => import('./pages/TechnologiesPage'));
// const WorkPage = lazy(() => import('./pages/WorkPage'));
// const ContactPage = lazy(() => import('./pages/ContactPage'));

export default function App() {
  return (
    <AppTheme>
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
              Charles Bradys portfolio
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
          navigationItems: navItems.map(({ label, href }) => ({ label, href })),
          signInText: 'GitHub',
          signUpText: 'Resume',
          onSignInClick: () =>
            window.open('https://github.com/charlesmbrady', '_blank'),
          onSignUpClick: () => window.open('/resume.pdf', '_blank'),
          showColorMode: true,
        }}
      />
      <Box sx={{ pt: { xs: 8, md: 12 }, minHeight: '100vh' }}>
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
