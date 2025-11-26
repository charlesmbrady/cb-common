import * as React from 'react';
import { Box } from '../../../../core';
import Sitemark from '../SitemarkIcon';
import { AppBarNavigation, AppBarNavigationProps } from './AppBarNavigation';

export type AppBarBrandProps = {
  logo?: React.ReactNode;
  navigationProps?: AppBarNavigationProps;
};

export function AppBarBrand({
  logo = <Sitemark />,
  navigationProps,
}: AppBarBrandProps) {
  return (
    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
      {logo}
      <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
        <AppBarNavigation {...navigationProps} />
      </Box>
    </Box>
  );
}
