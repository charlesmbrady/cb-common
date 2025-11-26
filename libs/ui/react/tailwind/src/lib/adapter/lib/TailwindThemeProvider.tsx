/**
 * Sets a theme name on the DOM (used by your Tailwind CSS-variable themes) and optionally toggles dark mode class.
 */

import * as React from 'react';

export type TailwindTheme = 'base' | 'glass' | 'sharp' | 'neo';
export type ColorMode = 'system' | 'dark' | 'light';

export function TailwindThemeProvider({
  children,
  theme = 'base',
  colorMode = 'system', // toggles 'dark' class on <html>
  attrTarget = 'html', // 'html' or 'body'
}: {
  children: React.ReactNode;
  theme?: TailwindTheme;
  colorMode?: ColorMode;
  attrTarget?: 'html' | 'body';
}) {
  React.useEffect(() => {
    const el = attrTarget === 'body' ? document.body : document.documentElement;
    el.setAttribute('data-theme', theme);
    if (colorMode === 'dark') el.classList.add('dark');
    else if (colorMode === 'light') el.classList.remove('dark');
    else {
      // system
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      el.classList.toggle('dark', prefersDark);
    }
  }, [theme, colorMode, attrTarget]);

  return <>{children}</>;
}
