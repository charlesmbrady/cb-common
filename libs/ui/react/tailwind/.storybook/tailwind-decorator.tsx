import * as React from 'react';
// if you have a TW provider for data-theme/dark mode:
import { TailwindThemeProvider } from '../src/lib/adapter';
// import './tailwind-storybook.css'; // package-local CSS with @tailwind base; components; utilities

export const tailwindDecorator = (Story: any) => (
  <TailwindThemeProvider theme="base" colorMode="system">
    <Story />
  </TailwindThemeProvider>
);
