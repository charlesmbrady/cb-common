import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';

type ColorMode = 'light' | 'dark';

export function useResolvedColorScheme(): ColorMode {
  const theme = useTheme();

  const readColorScheme = () => {
    if (typeof document !== 'undefined') {
      const attr = document.documentElement.getAttribute(
        'data-mui-color-scheme'
      );
      if (attr === 'dark' || attr === 'light') {
        return attr;
      }
    }
    return (theme.palette.mode as ColorMode) || 'light';
  };

  const [mode, setMode] = useState<ColorMode>(() => readColorScheme());

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;

    const observer = new MutationObserver(() => {
      setMode(readColorScheme());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-mui-color-scheme'],
    });

    return () => observer.disconnect();
  }, []);

  return mode;
}
