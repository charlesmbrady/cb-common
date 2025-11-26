'use client';

// USAGE EXAMPLE:
// apps/site-foo-next/app/layout.tsx
// import { NextUIProvider } from '@cb-common/ui-adapters-next';
// import { glassTheme } from '@cb-common/ui-mui-theme-glass';

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <body>
//         <NextUIProvider theme={glassTheme}>{children}</NextUIProvider>
//       </body>
//     </html>
//   );
// }

import * as React from 'react';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { baseTheme } from '../../../shared-theme/themes/BaseTheme/BaseTheme';
import { Theme } from '@mui/material/styles';

const muiCache = createCache({ key: 'mui', prepend: true });

export interface NextUIProviderProps {
  children: React.ReactNode;
  theme?: Theme; // MUI Theme
}

export function NextUIProvider({ children, theme }: NextUIProviderProps) {
  return (
    <CacheProvider value={muiCache}>
      <ThemeProvider theme={(theme as Theme) ?? (baseTheme as Theme)}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
