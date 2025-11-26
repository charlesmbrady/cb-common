import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import { AppBar, Container } from '../../../../core';
import Toolbar from '@mui/material/Toolbar';
import { AppBarBrand, AppBarBrandProps } from './AppBarBrand';
import { AppBarActions, AppBarActionsProps } from './AppBarActions';
import { AppBarMobileMenu, AppBarMobileMenuProps } from './AppBarMobileMenu';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: '8px 12px',
}));

export type AppAppBarCommonProps = {
  brandProps?: AppBarBrandProps;
  actionsProps?: AppBarActionsProps;
  mobileMenuProps?: AppBarMobileMenuProps;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};

export function AppAppBarCommon({
  brandProps,
  actionsProps,
  mobileMenuProps,
  maxWidth = 'lg',
}: AppAppBarCommonProps) {
  return (
    <AppBar
      position="fixed"
      color="default"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        mt: 'calc(var(--template-frame-height, 0px) + 28px)',
      }}
    >
      <Container maxWidth={maxWidth}>
        <StyledToolbar variant="dense" disableGutters>
          <AppBarBrand {...brandProps} />
          <AppBarActions {...actionsProps} />
          <AppBarMobileMenu {...mobileMenuProps} />
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
