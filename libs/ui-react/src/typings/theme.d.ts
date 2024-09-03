// this import is required for the types to apply correctly
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Theme as MuiTheme, ButtonPropsColorOverrides } from '@mui/material';
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    sun: true;
    whale: true;
    iris: true;
    midnight: true;
    aqua: true;
    pear: true;
  }
}

declare module '@mui/material/styles' {
  interface Theme {
    palette: Palette;
  }

  interface ThemeOptions {
    palette?: Palette;
  }

  interface TypographyVariants {
    header: React.CSSProperties;
    headline: React.CSSProperties;
    subhead: React.CSSProperties;
    callout: React.CSSProperties;
    bodyCopy: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    header?: React.CSSProperties;
    headline?: React.CSSProperties;
    subhead?: React.CSSProperties;
    callout?: React.CSSProperties;
    bodyCopy?: React.CSSProperties;
  }

  interface PaletteOptions {
    sun?: PaletteColorOptions;
    whale?: PaletteColorOptions;
    iris?: PaletteColorOptions;
    midnight?: PaletteColorOptions;
    aqua?: PaletteColorOptions;
    pear?: PaletteColorOptions;
  }
  interface Palette {
    sun: PaletteColor;
    whale: PaletteColor;
    iris: PaletteColor;
    midnight: PaletteColor;
    aqua: PaletteColor;
    pear: PaletteColor;
  }
}
// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    header: true;
    headline: true;
    subhead: true;
    callout: true;
    bodyCopy: true;
  }
}
