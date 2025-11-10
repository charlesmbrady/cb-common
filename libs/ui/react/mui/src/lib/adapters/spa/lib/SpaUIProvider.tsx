'use client';

import * as React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { baseTheme } from '../../../shared-theme/themes/BaseTheme/BaseTheme';
import { Theme } from '@mui/material/styles';

export interface SpaUIProviderProps {
  children: React.ReactNode;
  theme?: Theme; // MUI Theme; kept loose to avoid import cycles
}

export function SpaUIProvider({ children, theme }: SpaUIProviderProps) {
  return (
    <ThemeProvider theme={(theme as Theme) ?? (baseTheme as Theme)}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
