import * as React from 'react';
import { NextAppProvider } from '@toolpad/core/nextjs';
import { PageContainer } from '@toolpad/core/PageContainer';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import Head from 'next/head';
import { AppCacheProvider } from '@mui/material-nextjs/v14-pagesRouter';
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InfoIcon from '@mui/icons-material/Info';
import type { Navigation } from '@toolpad/core/AppProvider';
import { DocumentScanner, HelpOutline, Settings } from '@mui/icons-material';
import {
  List,
  ListItem,
  Box,
  CssBaseline,
  IconButton,
  Typography,
  Button,
  Divider,
} from '@mui/material';
import { MockdatProvider } from '../context/MockdatContext';

import { AuthProvider, useAuth } from '@cb-common/auth';
import { cognitoConfig } from '../config/amplify';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';

import Image from 'next/image';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import AppBar from '@mui/material/AppBar';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';

import MenuIcon from '@mui/icons-material/Menu';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Link from 'next/link';
import GitHubIcon from '@mui/icons-material/GitHub';
import { lightTheme, darkTheme } from '../theme';
import ListItemButton from '@mui/material/ListItemButton';

const NAVIGATION: Navigation = [
  {
    segment: 'about',
    title: 'About',
    icon: <InfoIcon />,
  },
  {
    segment: 'documentation',
    title: 'Documentation',
    icon: <DocumentScanner />,
  },
  {
    segment: 'help',
    title: 'Help',
    icon: <HelpOutline />,
  },
  {
    kind: 'divider',
  },
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
];

const BRANDING = {
  title: 'Mockdat',
  logo: (
    <Box sx={{ width: 40, height: 40, position: 'relative' }}>
      <Image
        src="/mockdat_logo.svg"
        alt="Mockdat Logo"
        fill
        style={{ objectFit: 'contain' }}
      />
    </Box>
  ),
};

function SidebarFooter() {
  return (
    <List>
      <ListItem>@Mockdat</ListItem>
    </List>
  );
}

// Add the static DotMLogo SVG (without animation styles)
const DotMLogo = () => (
  <svg
    width="48"
    height="24"
    viewBox="0 0 200 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: 'block' }}
  >
    <defs>
      <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#1976d2" stopOpacity="1" />
        <stop offset="50%" stopColor="#64b5f6" stopOpacity="1" />
        <stop offset="100%" stopColor="#1976d2" stopOpacity="1" />
      </linearGradient>
    </defs>
    <g transform="translate(0,0)">
      <path
        d="M 10 55 L 10 10 L 40 50 L 70 10 L 70 55"
        stroke="url(#gradient1)"
        strokeWidth="7"
        filter="drop-shadow(0 0 2px rgba(25, 118, 210, 0.3))"
        fill="none"
      />
    </g>
  </svg>
);

function DrawerLoginLogout() {
  const { user, signIn, signOut } = useAuth?.() || {};
  return (
    <Box sx={{ p: 2, textAlign: 'center' }}>
      {user ? (
        <Button variant="outlined" color="primary" onClick={signOut} fullWidth>
          Log out
        </Button>
      ) : (
        <Button variant="contained" color="primary" onClick={signIn} fullWidth>
          Log in
        </Button>
      )}
    </Box>
  );
}

export default function App({ Component }: { Component: React.ElementType }) {
  const [mode, setMode] = React.useState<'light' | 'dark'>('dark');
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const theme = mode === 'light' ? lightTheme : darkTheme;

  // Navigation items
  type NavItem =
    | { label: string; href: string; icon: React.ReactNode }
    | { divider: true };
  const navItems: NavItem[] = [
    { label: 'Dashboard', href: '/dashboard', icon: <DashboardIcon /> },
    { divider: true },
    {
      label: 'Documentation',
      href: '/documentation',
      icon: <DocumentScanner />,
    },
  ];

  return (
    <AuthProvider config={cognitoConfig}>
      <AppCacheProvider>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <MockdatProvider>
            <AppBar position="fixed" color="primary" elevation={1}>
              <Toolbar>
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                  <DotMLogo />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Link href="/" passHref legacyBehavior>
                    <Typography
                      component="a"
                      sx={{
                        fontFamily: 'Orbitron, sans-serif',
                        fontWeight: 700,
                        fontSize: '1.5rem',
                        letterSpacing: 2,
                        color: 'inherit',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        transition: 'color 0.2s',
                        '&:hover': {
                          color: 'primary.light',
                        },
                      }}
                    >
                      Mockdat
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
                sx={(theme) => ({
                  width: 260,
                  pt: 2,
                  color: theme.palette.mode === 'dark' ? '#fff' : 'inherit',
                  '& .MuiListItemText-root, & .MuiListItemIcon-root, & .MuiTypography-root, & svg':
                    {
                      color: theme.palette.mode === 'dark' ? '#fff' : 'inherit',
                    },
                })}
                role="presentation"
                onClick={() => setDrawerOpen(false)}
              >
                <List>
                  {navItems.map((item, idx) =>
                    'divider' in item ? (
                      <Divider key={idx} sx={{ my: 1 }} />
                    ) : (
                      <Link
                        href={item.href}
                        passHref
                        legacyBehavior
                        key={item.label}
                      >
                        <ListItemButton
                          component="a"
                          sx={{ cursor: 'pointer' }}
                        >
                          <ListItemIcon>{item.icon}</ListItemIcon>
                          <ListItemText primary={item.label} />
                        </ListItemButton>
                      </Link>
                    )
                  )}
                </List>
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <a
                    href="https://github.com/charlesmbrady/cb-common/tree/main/apps/mockdat"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'inherit', textDecoration: 'none' }}
                  >
                    <GitHubIcon fontSize="large" />
                  </a>
                </Box>
                <DrawerLoginLogout />
              </Box>
            </Drawer>
            <Toolbar /> {/* Spacer for fixed AppBar */}
            <Box
              sx={{
                minHeight: '100vh',
                backgroundColor: theme.palette.background.default,
              }}
            >
              <Component />
            </Box>
          </MockdatProvider>
        </ThemeProvider>
      </AppCacheProvider>
    </AuthProvider>
  );
}
