import { createTheme, alpha } from '@mui/material/styles';
import {
  baseThemeComponents,
  typography as baseTypography,
  shadows,
  shape,
  brand,
  gray,
  green,
  orange,
  red,
} from '@cb-common/ui-react-mui';

declare module '@mui/material/styles' {
  interface PaletteOptions {
    baseShadow?: string;
  }
}

/**
 * Antique gold ramp — the portfolio accent color.
 * Warm, bronze-leaning tones that read "crafted" rather than flashy.
 */
export const gold = {
  50: 'hsl(46, 80%, 96%)',
  100: 'hsl(46, 75%, 89%)',
  200: 'hsl(45, 70%, 77%)',
  300: 'hsl(44, 65%, 64%)',
  400: 'hsl(43, 60%, 52%)',
  500: 'hsl(42, 62%, 42%)',
  600: 'hsl(41, 65%, 34%)',
  700: 'hsl(40, 68%, 26%)',
  800: 'hsl(39, 70%, 18%)',
  900: 'hsl(38, 72%, 12%)',
};

const displayFont = '"Cinzel", "Times New Roman", serif';

/**
 * Portfolio theme: built on the shared base theme, swapping the brand blue
 * for antique gold, warming the surfaces slightly, and using a carved-serif
 * display face for the largest headings.
 */
export const portfolioTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-mui-color-scheme',
    cssVarPrefix: 'template',
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          light: gold[300],
          main: gold[600],
          dark: gold[800],
          contrastText: gold[50],
        },
        info: {
          light: brand[100],
          main: brand[300],
          dark: brand[600],
          contrastText: gray[50],
        },
        warning: { light: orange[300], main: orange[400], dark: orange[800] },
        error: { light: red[300], main: red[400], dark: red[800] },
        success: { light: green[300], main: green[400], dark: green[800] },
        grey: { ...gray },
        divider: alpha('hsl(40, 25%, 40%)', 0.22),
        background: {
          default: 'hsl(40, 24%, 98%)',
          paper: 'hsl(42, 28%, 96%)',
        },
        text: {
          primary: 'hsl(222, 25%, 12%)',
          secondary: 'hsl(222, 14%, 36%)',
        },
        action: {
          hover: alpha(gold[200], 0.18),
          selected: alpha(gold[200], 0.28),
        },
        baseShadow:
          'hsla(40, 30%, 10%, 0.07) 0px 4px 16px 0px, hsla(40, 25%, 10%, 0.07) 0px 8px 16px -5px',
      },
    },
    dark: {
      palette: {
        primary: {
          light: gold[200],
          main: gold[300],
          dark: gold[500],
          contrastText: 'hsl(40, 70%, 8%)',
        },
        info: {
          light: brand[500],
          main: brand[700],
          dark: brand[900],
          contrastText: brand[300],
        },
        warning: { light: orange[400], main: orange[500], dark: orange[700] },
        error: { light: red[400], main: red[500], dark: red[700] },
        success: { light: green[400], main: green[500], dark: green[700] },
        grey: { ...gray },
        divider: alpha('hsl(45, 45%, 70%)', 0.14),
        background: {
          default: 'hsl(222, 32%, 4%)',
          paper: 'hsl(222, 28%, 7%)',
        },
        text: {
          primary: 'hsl(42, 30%, 96%)',
          secondary: 'hsl(220, 14%, 68%)',
        },
        action: {
          hover: alpha(gold[400], 0.12),
          selected: alpha(gold[400], 0.2),
        },
        baseShadow:
          'hsla(222, 30%, 2%, 0.7) 0px 4px 16px 0px, hsla(222, 25%, 5%, 0.8) 0px 8px 16px -5px',
      },
    },
  },
  typography: {
    ...baseTypography,
    h1: {
      ...baseTypography.h1,
      fontFamily: displayFont,
      fontWeight: 700,
      letterSpacing: 1,
    },
    h2: {
      ...baseTypography.h2,
      fontFamily: displayFont,
      fontWeight: 700,
      letterSpacing: 0.5,
    },
    h3: {
      ...baseTypography.h3,
      fontFamily: displayFont,
      fontWeight: 600,
      letterSpacing: 0.5,
    },
  },
  shadows,
  shape,
  components: {
    ...baseThemeComponents,
    // The base theme hardcodes contained-primary buttons to a gray/white
    // gradient; restyle them as burnished gold so CTAs match the accent.
    MuiButton: {
      ...(baseThemeComponents as any).MuiButton,
      styleOverrides: {
        ...(baseThemeComponents as any).MuiButton?.styleOverrides,
        root: (params: any) => {
          const baseRoot = (baseThemeComponents as any).MuiButton
            ?.styleOverrides?.root;
          const base =
            typeof baseRoot === 'function' ? baseRoot(params) : baseRoot ?? {};
          const { theme } = params;
          return {
            ...base,
            variants: [
              ...(base.variants ?? []),
              {
                props: { color: 'primary', variant: 'contained' },
                style: {
                  color: gold[50],
                  backgroundColor: gold[600],
                  backgroundImage: `linear-gradient(to bottom, ${gold[500]}, ${gold[600]})`,
                  boxShadow: `inset 0 1px 0 ${alpha(
                    gold[300],
                    0.5
                  )}, inset 0 -1px 0 1px ${gold[800]}`,
                  border: `1px solid ${gold[700]}`,
                  '&:hover': {
                    backgroundImage: 'none',
                    backgroundColor: gold[500],
                    boxShadow: 'none',
                  },
                  '&:active': {
                    backgroundColor: gold[700],
                  },
                  ...theme.applyStyles('dark', {
                    color: 'hsl(40, 70%, 8%)',
                    backgroundColor: gold[300],
                    backgroundImage: `linear-gradient(to bottom, ${gold[200]}, ${gold[300]})`,
                    boxShadow: `inset 0 1px 0 ${alpha(
                      gold[100],
                      0.6
                    )}, inset 0 -1px 0 1px ${gold[600]}`,
                    border: `1px solid ${gold[400]}`,
                    '&:hover': {
                      backgroundImage: 'none',
                      backgroundColor: gold[200],
                      boxShadow: 'none',
                    },
                    '&:active': {
                      backgroundColor: gold[400],
                    },
                  }),
                },
              },
            ],
          };
        },
      },
    },
  },
});
