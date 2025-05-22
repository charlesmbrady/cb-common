// Uncomment this line to use CSS modules
// import styles from './app.module.css';
import React, { lazy, Suspense } from 'react';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import {
  ThemeProvider,
  CssBaseline,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  Button,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import GitHubIcon from '@mui/icons-material/GitHub';
import InfoIcon from '@mui/icons-material/Info';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CodeIcon from '@mui/icons-material/Code';
import EmailIcon from '@mui/icons-material/Email';
import { lightTheme, darkTheme } from './theme';

const navItems = [
  { label: 'About', href: '/about', icon: <InfoIcon /> },
  { label: 'Projects', href: '/projects', icon: <DashboardIcon /> },
  { label: 'Technologies', href: '/technologies', icon: <CodeIcon /> },
  { label: 'Contact', href: '/contact', icon: <EmailIcon /> },
];

const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const TechnologiesPage = lazy(() => import('./pages/TechnologiesPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));

function App() {
  const [mode, setMode] = React.useState<'light' | 'dark'>('dark');
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const theme = mode === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="fixed" color="primary" elevation={1}>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Typography
                sx={{
                  fontFamily: 'Orbitron, sans-serif',
                  fontWeight: 700,
                  fontSize: '1.5rem',
                  letterSpacing: 2,
                  color: 'inherit',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                  '&:hover': { color: 'primary.light' },
                }}
              >
                Charles M Brady
              </Typography>
            </Link>
          </Box>
          <IconButton
            color="inherit"
            size="medium"
            onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
            sx={{ ml: 1 }}
          >
            {mode === 'light' ? (
              <Brightness4Icon fontSize="medium" />
            ) : (
              <Brightness7Icon fontSize="medium" />
            )}
          </IconButton>
          <IconButton
            color="inherit"
            edge="end"
            size="medium"
            onClick={() => setDrawerOpen(true)}
            sx={{ ml: 2 }}
          >
            <MenuIcon fontSize="medium" />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box
          sx={{ width: 260, pt: 2 }}
          role="presentation"
          onClick={() => setDrawerOpen(false)}
        >
          <List>
            {navItems.map((item, idx) => (
              <Link
                to={item.href}
                key={item.label}
                style={{ textDecoration: 'none' }}
              >
                <ListItemButton component="div" sx={{ cursor: 'pointer' }}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </Link>
            ))}
          </List>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <a
              href="https://github.com/charlesmbrady/cb-common"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'inherit',
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              <GitHubIcon fontSize="large" />
            </a>
          </Box>
        </Box>
      </Drawer>
      <Toolbar /> {/* Spacer for fixed AppBar */}
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Routes>
          <Route
            path="/"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <HomePage />
              </Suspense>
            }
          />
          <Route
            path="/about"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <AboutPage />
              </Suspense>
            }
          />
          <Route
            path="/projects"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProjectsPage />
              </Suspense>
            }
          />
          <Route
            path="/technologies"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <TechnologiesPage />
              </Suspense>
            }
          />
          <Route
            path="/contact"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <ContactPage />
              </Suspense>
            }
          />
        </Routes>
      </Box>
    </ThemeProvider>
  );
}

export default App;
