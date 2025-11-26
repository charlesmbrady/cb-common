// Uncomment this line to use CSS modules
// import styles from './app.module.css';

import React from 'react';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import {
  AppConfigProvider,
  UserProvider,
  useUser,
} from '@cb-common/ui-react-auth';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from './theme';
import { MockdatProvider } from './context/MockdatContext';
import LandingPage from './pages/index';
import Dashboard from './pages/dashboard/index';
import Documentation from './pages/documentation/index';
import WizardPage from './pages/wizard';
import LogoutPage from './pages/logout';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import GitHubIcon from '@mui/icons-material/GitHub';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DocumentScanner from '@mui/icons-material/DocumentScanner';
import InfoIcon from '@mui/icons-material/Info';
import HelpOutline from '@mui/icons-material/HelpOutline';
import Button from '@mui/material/Button';

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

function AuthenticatedSignOutButton() {
  const [userState, { signOut }] = useUser();
  if (!userState.data) return null;
  return (
    <Button
      variant="outlined"
      color="secondary"
      onClick={(e) => {
        e.stopPropagation();
        signOut();
      }}
      sx={{ mt: 2 }}
    >
      Sign Out
    </Button>
  );
}

function LoginButton() {
  const [userState, { signIn }] = useUser();
  if (userState.data) return null;
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={(e) => {
        e.stopPropagation();
        signIn();
      }}
      sx={{ mt: 2 }}
    >
      Login
    </Button>
  );
}

function AuthenticatedApp({ children }: { children: React.ReactNode }) {
  const [userState, { signIn }] = useUser();
  if (userState.isLoading) return <div>Loading...</div>;
  if (!userState.data) return <button onClick={signIn}>Sign In</button>;
  return <>{children}</>;
}

export function App() {
  const [mode, setMode] = React.useState<'light' | 'dark'>('dark');
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const theme = mode === 'light' ? lightTheme : darkTheme;
  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: <DashboardIcon /> },
    { divider: true },
    {
      label: 'Documentation',
      href: '/documentation',
      icon: <DocumentScanner />,
    },
  ];

  return (
    <AppConfigProvider>
      <UserProvider protectedRoutes={['/dashboard', '/wizard']}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <MockdatProvider>
            <AppBar position="fixed" color="primary" elevation={1}>
              <Toolbar>
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                  <DotMLogo />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Link to="/" style={{ textDecoration: 'none' }}>
                    <Typography
                      sx={{
                        fontFamily: 'Orbitron, sans-serif',
                        fontWeight: 700,
                        fontSize: '1.5rem',
                        letterSpacing: 2,
                        color: mode === 'light' ? '#fff' : 'inherit',
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
                        to={item.href}
                        key={item.label}
                        style={{ textDecoration: 'none' }}
                      >
                        <ListItemButton
                          component="div"
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
                    style={{
                      color: 'inherit',
                      textDecoration: 'none',
                      display: 'inline-block',
                    }}
                  >
                    <GitHubIcon fontSize="large" />
                  </a>
                  <Box sx={{ mt: 2 }}>
                    <AuthenticatedSignOutButton />
                    <LoginButton />
                  </Box>
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
                <Route path="/" element={<LandingPage />} />
                <Route
                  path="/dashboard"
                  element={
                    <AuthenticatedApp>
                      <Dashboard />
                    </AuthenticatedApp>
                  }
                />
                <Route path="/documentation" element={<Documentation />} />
                <Route
                  path="/wizard"
                  element={
                    <AuthenticatedApp>
                      <WizardPage />
                    </AuthenticatedApp>
                  }
                />
                <Route path="/logout" element={<LogoutPage />} />
              </Routes>
            </Box>
          </MockdatProvider>
        </ThemeProvider>
      </UserProvider>
    </AppConfigProvider>
  );
}

export default App;
