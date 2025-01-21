import * as React from 'react';
import { NextAppProvider } from '@toolpad/core/nextjs';
import { PageContainer } from '@toolpad/core/PageContainer';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import Head from 'next/head';
import { AppCacheProvider } from '@mui/material-nextjs/v14-pagesRouter';
import DashboardIcon from '@mui/icons-material/Dashboard';

import InfoIcon from '@mui/icons-material/Info';
import type { Navigation } from '@toolpad/core/AppProvider';

import { DocumentScanner, HelpOutline, Settings } from '@mui/icons-material';
import { List, ListItem } from '@mui/material';
import { MockdatProvider } from '../context/MockdatContext';

const NAVIGATION: Navigation = [
  // {
  //   kind: 'header',
  //   title: 'Main items',
  // },
  {
    segment: 'mockdat',
    title: 'Mockdat',
    children: [
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
      // divider

      {
        segment: 'help',
        title: 'Help',
        icon: <HelpOutline />,
      },
      // add home
      {
        kind: 'divider',
      },
      {
        segment: 'dashboard',
        title: 'Dashboard',
        icon: <DashboardIcon />,
      },
    ],
  },
];

const BRANDING = {
  title: 'Mockdat',
};

function SidebarFooter() {
  return (
    <List>
      <ListItem>@Mockdat</ListItem>
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
        <MockdatProvider>
          <DashboardLayout
            slots={{ sidebarFooter: SidebarFooter }}
            disableCollapsibleSidebar
          >
            <PageContainer>
              <Component />
            </PageContainer>
          </DashboardLayout>
        </MockdatProvider>
      </NextAppProvider>
    </AppCacheProvider>
  );
}
