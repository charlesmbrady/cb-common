// libs/storybook/storybook-config/src/mui-decorator.ts
import * as React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AppTheme } from '../src/lib/shared-theme';

export const muiDecorator = (Story: any, context: any) => {
  return (
    <AppTheme>
      <Story />
    </AppTheme>
  );
};
