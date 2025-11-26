import * as React from 'react';
import { ThemeProvider, Theme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { baseTheme } from './themes/BaseTheme/BaseTheme';

interface AppThemeProps {
  children: React.ReactNode;
  theme?: Theme;
}

export function AppTheme(props: AppThemeProps) {
  const { children, theme } = props;
  return (
    <ThemeProvider theme={theme || baseTheme} disableTransitionOnChange>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
