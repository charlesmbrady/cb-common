import * as React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  Divider,
  Button,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CallIcon from '@mui/icons-material/Call';
import WorkIcon from '@mui/icons-material/Work';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import InfoIcon from '@mui/icons-material/Info';
import LogoDevIcon from '@mui/icons-material/LogoDev';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const drawerWidth = 240;

const NAV_ITEMS = [
  { label: 'About', icon: <InfoIcon />, href: '/about' },
  { label: 'Contact', icon: <CallIcon />, href: '/contact' },
  { label: 'Work', icon: <WorkIcon />, href: '/work' },
  { label: 'Projects', icon: <DashboardIcon />, href: '/projects' },
  { label: 'Technologies', icon: <LogoDevIcon />, href: '/technologies' },
];

function SidebarFooter() {
  return (
    <Box sx={{ mt: 'auto', p: 2 }}>
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 2 }}>
        <IconButton
          href="https://www.linkedin.com/in/charlesmbrady/"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ color: 'primary.main' }}
        >
          <LinkedInIcon />
        </IconButton>
        <IconButton
          href="https://github.com/charlesmbrady"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ color: 'primary.main' }}
        >
          <GitHubIcon />
        </IconButton>
      </Box>
      <Button
        fullWidth
        component="a"
        href="CharlesBrady_resume.pdf"
        target="_blank"
        rel="noreferrer"
        variant="contained"
        color="primary"
        endIcon={<OpenInNewIcon fontSize="small" />}
      >
        View Resume
      </Button>
    </Box>
  );
}

export default function App({
  Component,
  pageProps,
}: {
  Component: React.ElementType;
  pageProps: any;
}) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Charles Brady
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {NAV_ITEMS.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              component={Link}
              href={item.href}
              onClick={() => setMobileOpen(false)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <SidebarFooter />
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <LogoDevIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Charles Brady
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Component {...pageProps} />
      </Box>
    </Box>
  );
}
