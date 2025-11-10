import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import {
  Box,
  Button,
  Drawer,
  Divider,
  MenuItem,
  Link,
  RouterLink,
} from '../../../../core';
import { ColorModeIconDropdown } from '../../../../shared-theme';
import { AppBarNavigationItem } from './AppBarNavigation';

export type AppBarMobileMenuProps = {
  navigationItems?: AppBarNavigationItem[];
  signInText?: string;
  signUpText?: string;
  onSignInClick?: () => void;
  onSignUpClick?: () => void;
  showColorMode?: boolean;
};

const defaultNavigationItems: AppBarNavigationItem[] = [
  { label: 'Features' },
  { label: 'Testimonials' },
  { label: 'Highlights' },
  { label: 'Pricing' },
  { label: 'FAQ' },
  { label: 'Blog' },
];

export function AppBarMobileMenu({
  navigationItems = defaultNavigationItems,
  signInText = 'Sign in',
  signUpText = 'Sign up',
  onSignInClick,
  onSignUpClick,
  showColorMode = true,
}: AppBarMobileMenuProps) {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
      {showColorMode && <ColorModeIconDropdown size="medium" />}
      <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor="top"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            top: 'var(--template-frame-height, 0px)',
          },
        }}
      >
        <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <IconButton onClick={toggleDrawer(false)}>
              <CloseRoundedIcon />
            </IconButton>
          </Box>

          {navigationItems.map((item, index) => {
            const isInternal = !!item.href && item.href.startsWith('/');
            const linkContent = isInternal ? (
              <RouterLink
                to={item.href!}
                underline="none"
                color="inherit"
                style={{ width: '100%', display: 'block' }}
              >
                {item.label}
              </RouterLink>
            ) : item.href ? (
              <Link
                underline="none"
                color="inherit"
                href={item.href}
                style={{ width: '100%', display: 'block' }}
              >
                {item.label}
              </Link>
            ) : (
              item.label
            );
            return (
              <MenuItem
                key={index}
                onClick={() => {
                  // always close drawer then run custom click
                  setOpen(false);
                  item.onClick?.();
                }}
              >
                {linkContent}
              </MenuItem>
            );
          })}

          <Divider sx={{ my: 3 }} />

          <MenuItem>
            <Button
              color="primary"
              variant="contained"
              fullWidth
              onClick={onSignUpClick}
            >
              {signUpText}
            </Button>
          </MenuItem>
          <MenuItem>
            <Button
              color="primary"
              variant="outlined"
              fullWidth
              onClick={onSignInClick}
            >
              {signInText}
            </Button>
          </MenuItem>
        </Box>
      </Drawer>
    </Box>
  );
}
