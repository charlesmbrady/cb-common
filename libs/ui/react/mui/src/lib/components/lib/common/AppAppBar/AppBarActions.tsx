import * as React from 'react';
import { Button, Box } from '../../../../core';
import { ColorModeIconDropdown } from '../../../../shared-theme';

export type AppBarActionsProps = {
  signInText?: string;
  signUpText?: string;
  onSignInClick?: () => void;
  onSignUpClick?: () => void;
  showColorMode?: boolean;
};

export function AppBarActions({
  signInText = 'Sign in',
  signUpText = 'Sign up',
  onSignInClick,
  onSignUpClick,
  showColorMode = true,
}: AppBarActionsProps) {
  return (
    <Box
      sx={{
        display: { xs: 'none', md: 'flex' },
        gap: 1,
        alignItems: 'center',
      }}
    >
      <Button
        color="primary"
        variant="text"
        size="small"
        onClick={onSignInClick}
      >
        {signInText}
      </Button>
      <Button
        color="primary"
        variant="contained"
        size="small"
        onClick={onSignUpClick}
      >
        {signUpText}
      </Button>
      {showColorMode && <ColorModeIconDropdown />}
    </Box>
  );
}
