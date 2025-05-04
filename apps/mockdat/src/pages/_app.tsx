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
import { List, ListItem, Box, CssBaseline, IconButton } from '@mui/material';
import { MockdatProvider } from '../context/MockdatContext';
import Image from 'next/image';
import './styles.css';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

// Mernolithic theme colors
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4F46E5', // Indigo
      light: '#6366F1',
      dark: '#4338CA',
    },
    secondary: {
      main: '#10B981', // Emerald
      light: '#34D399',
      dark: '#059669',
    },
    background: {
      default: '#F9FAFB',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1F2937',
      secondary: '#6B7280',
    },
  },
  typography: {
    fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
    h1: {
      fontFamily: '"Orbitron", sans-serif',
      fontWeight: 700,
      fontSize: '3.5rem',
      letterSpacing: '0.02em',
      background: 'linear-gradient(45deg, #4F46E5, #10B981)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h2: {
      fontFamily: '"Orbitron", sans-serif',
      fontWeight: 600,
      fontSize: '2.5rem',
      letterSpacing: '0.02em',
      background: 'linear-gradient(45deg, #4F46E5, #6366F1)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h3: {
      fontFamily: '"Orbitron", sans-serif',
      fontWeight: 600,
      fontSize: '2rem',
      letterSpacing: '0.02em',
    },
    h4: {
      fontFamily: '"Orbitron", sans-serif',
      fontWeight: 500,
      fontSize: '1.75rem',
      letterSpacing: '0.02em',
    },
    h5: {
      fontFamily: '"Orbitron", sans-serif',
      fontWeight: 500,
      fontSize: '1.5rem',
      letterSpacing: '0.02em',
    },
    h6: {
      fontFamily: '"Orbitron", sans-serif',
      fontWeight: 500,
      fontSize: '1.25rem',
      letterSpacing: '0.02em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      fontFamily: '"Inter", sans-serif',
      fontSize: '1rem',
    },
    body1: {
      fontFamily: '"Inter", sans-serif',
      lineHeight: 1.6,
      fontSize: '1.1rem',
    },
    body2: {
      fontFamily: '"Inter", sans-serif',
      lineHeight: 1.6,
      fontSize: '1rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          background: 'linear-gradient(45deg, #4F46E5, #6366F1)',
          color: 'white',
          '&:hover': {
            background: 'linear-gradient(45deg, #4338CA, #4F46E5)',
          },
        },
        outlined: {
          background: 'transparent',
          border: '2px solid #4F46E5',
          color: '#4F46E5',
          '&:hover': {
            background: 'linear-gradient(45deg, #4F46E5, #6366F1)',
            color: 'white',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow:
            '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          background: 'linear-gradient(135deg, #FFFFFF, #F9FAFB)',
          border: '1px solid rgba(79, 70, 229, 0.1)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '4px 8px',
          '&:hover': {
            background:
              'linear-gradient(45deg, rgba(79, 70, 229, 0.1), rgba(99, 102, 241, 0.1))',
          },
          '&.Mui-selected': {
            background: 'linear-gradient(45deg, #4F46E5, #6366F1)',
            color: 'white',
            '&:hover': {
              background: 'linear-gradient(45deg, #4338CA, #4F46E5)',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(45deg, #4F46E5, #6366F1)',
        },
      },
    },
  },
});

const darkTheme = createTheme({
  ...lightTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366F1',
      light: '#818CF8',
      dark: '#4F46E5',
    },
    secondary: {
      main: '#34D399',
      light: '#6EE7B7',
      dark: '#10B981',
    },
    background: {
      default: '#111827',
      paper: '#1F2937',
    },
    text: {
      primary: '#F9FAFB',
      secondary: '#D1D5DB',
    },
  },
  components: {
    ...lightTheme.components,
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow:
            '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)',
          background: 'linear-gradient(135deg, #1F2937, #111827)',
          border: '1px solid rgba(99, 102, 241, 0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#111827',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#111827',
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(45deg, #1F2937, #111827)',
          borderBottom: '1px solid rgba(99, 102, 241, 0.1)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '4px 8px',
          '&:hover': {
            background:
              'linear-gradient(45deg, rgba(99, 102, 241, 0.1), rgba(129, 140, 248, 0.1))',
          },
          '&.Mui-selected': {
            background: 'linear-gradient(45deg, #6366F1, #818CF8)',
            color: 'white',
            '&:hover': {
              background: 'linear-gradient(45deg, #4F46E5, #6366F1)',
            },
          },
        },
      },
    },
    MuiStepper: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
        },
      },
    },
    MuiStepLabel: {
      styleOverrides: {
        root: {
          color: '#F9FAFB',
          '&.Mui-completed': {
            color: '#34D399',
          },
          '&.Mui-active': {
            color: '#6366F1',
          },
        },
      },
    },
    MuiStepConnector: {
      styleOverrides: {
        line: {
          borderColor: '#374151',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#1F2937',
            '& fieldset': {
              borderColor: '#374151',
            },
            '&:hover fieldset': {
              borderColor: '#6366F1',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#6366F1',
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: '#1F2937',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#374151',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#6366F1',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#6366F1',
          },
        },
      },
    },
  },
});

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
    segment: 'settings',
    title: 'Settings',
    icon: <Settings />,
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

export default function App({ Component }: { Component: React.ElementType }) {
  const [mode, setMode] = React.useState<'light' | 'dark'>('dark');
  const theme = mode === 'light' ? lightTheme : darkTheme;

  return (
    <AppCacheProvider>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <NextAppProvider navigation={NAVIGATION} branding={BRANDING}>
          <MockdatProvider>
            <DashboardLayout
              slots={{ sidebarFooter: SidebarFooter }}
              disableCollapsibleSidebar
            >
              <PageContainer sx={{ backgroundColor: 'background.default' }}>
                <Component />
              </PageContainer>
            </DashboardLayout>
          </MockdatProvider>
        </NextAppProvider>
      </ThemeProvider>
    </AppCacheProvider>
  );
}
