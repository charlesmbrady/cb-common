import * as React from 'react';
import { NextAppProvider } from '@toolpad/core/nextjs';
import { PageContainer } from '@toolpad/core/PageContainer';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import Head from 'next/head';
import { AppCacheProvider } from '@mui/material-nextjs/v14-pagesRouter';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CallIcon from '@mui/icons-material/Call';
import WorkIcon from '@mui/icons-material/Work';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import InfoIcon from '@mui/icons-material/Info';
import type { Navigation } from '@toolpad/core/AppProvider';
import LogoDevIcon from '@mui/icons-material/LogoDev';
import { Call, Highlight, Layers } from '@mui/icons-material';
import {
  Button,
  Divider,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Box,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';

const NAVIGATION: Navigation = [
  {
    segment: 'about',
    title: 'About',
    icon: <InfoIcon />,
  },
  {
    segment: 'contact',
    title: 'Contact',
    icon: <Call />,
  },
  {
    segment: 'work',
    title: 'Work',
    icon: <WorkIcon />,
  },
  {
    segment: 'projects',
    title: 'Projects',
    icon: <DashboardIcon />,
  },
  {
    segment: 'technologies',
    title: 'Technologies',
    icon: <Layers />,
  },
];

const BRANDING = {
  title: 'Charles Brady',
  logo: (
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        backgroundImage: 'url(https://avatars.githubusercontent.com/u/37607365?v=4)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        border: '2px solid',
        borderColor: 'primary.main',
      }}
    />
  ),
};

function SidebarFooter() {
  return (
    <List>
      <ListItem>
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', width: '100%', mb: 2 }}>
          <IconButton
            href="https://www.linkedin.com/in/charlesmbrady/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: 'primary.main',
              '&:hover': {
                transform: 'scale(1.1)',
                color: 'primary.dark',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <LinkedInIcon />
          </IconButton>
          <IconButton
            href="https://github.com/charlesmbrady"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: 'primary.main',
              '&:hover': {
                transform: 'scale(1.1)',
                color: 'primary.dark',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <GitHubIcon />
          </IconButton>
        </Box>
      </ListItem>
      <ListItem>
        <ListItemButton
          component="a"
          href="CharlesBrady_resume.pdf"
          target="_blank"
          rel="noreferrer"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            backgroundColor: 'primary.main',
            color: 'primary.contrastText',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
          }}
        >
          <ListItemText primary="View Resume" />
          <OpenInNewIcon fontSize="small" />
        </ListItemButton>
      </ListItem>
    </List>
  );
}

export default function App({ Component }: { Component: React.ElementType }) {
  return (
    <AppCacheProvider>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <NextAppProvider navigation={NAVIGATION} branding={BRANDING}>
        <DashboardLayout
          slots={{ sidebarFooter: SidebarFooter }}
          disableCollapsibleSidebar
        >
          <PageContainer>
            <Component />
          </PageContainer>
        </DashboardLayout>
      </NextAppProvider>
    </AppCacheProvider>
  );
}
