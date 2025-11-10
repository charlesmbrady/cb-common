# adapter

## How to use in Next.js (App Router)

```tsx
// apps/site-foo-next/app/layout.tsx
import type { Metadata } from 'next';
import { ThemeScript, TailwindThemeProvider } from '@cb-common/ui-tailwind-adapter';
// Important: global CSS must import Tailwind base/utilities
import './globals.css';

export const metadata: Metadata = { title: 'Foo' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript defaultTheme="base" defaultColorMode="system" />
      </head>
      <body>
        <TailwindThemeProvider theme="base" colorMode="system">
          {children}
        </TailwindThemeProvider>
      </body>
    </html>
  );
}
```

### How to use in React (Classic)

```tsx
// apps/site-foo-react/src/app/layout.tsx
import * as React from 'react';
import { ThemeScript, TailwindThemeProvider } from '@cb-common/ui-tailwind-adapter';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript defaultTheme="base" defaultColorMode="system" />
      </head>
      <body>
        <TailwindThemeProvider theme="base" colorMode="system">
          {children}
        </TailwindThemeProvider>
      </body>
    </html>
  );
}
```

### How to use in SPA (Vite)

```tsx
// apps/app-bar-spa/src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { TailwindThemeProvider } from '@cb-common/ui-tailwind-adapter';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <TailwindThemeProvider theme="base" colorMode="system">
    <App />
  </TailwindThemeProvider>
);
```
