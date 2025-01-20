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
  Divider,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Typography,
} from '@mui/material';

const NAVIGATION: Navigation = [
  // {
  //   kind: 'header',
  //   title: 'Main items',
  // },
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
    segment: 'portfolio',
    title: 'Portfolio',
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
    <img
      src="https://avatars.githubusercontent.com/u/37607365?v=4" //TODO: replace with my own logo
      alt="Charles Brady"
    />
  ),
};

function SidebarFooter() {
  return (
    <List>
      <ListItem>
        <ListItemButton>
          <ListItemIcon>
            <ContactPageIcon />
          </ListItemIcon>

          <a href="CharlesBrady_resume.pdf" target="_blank" rel="noreferrer">
            View Resume
          </a>
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
