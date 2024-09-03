import {
  ThemeProvider as muiThemeProvider,
  ThemeOptions,
  createTheme as muiCreateTheme,
} from '@mui/material';

const colors = {
  lightGreen: '#91C699',
  maximumBlue: '#63B0CD',
  mediumBlue: '#3B28CC',
  navy: '#013E61',
  aqua: '#65BCCD',
  pear: '#7FAF5C',
};

const palette = {
  lightGreen: {
    main: colors.lightGreen,
    light: '#B8DABD',
    dark: '#4B9155',
    contrastText: 'rgba(0, 0, 0, 0.87)',
  },
  maximumBlue: {
    main: colors.maximumBlue,
    light: '#9CCDDF',
    dark: '#307A95',
    contrastText: 'rgba(0, 0, 0, 0.87)',
  },
  mediumBlue: {
    main: colors.mediumBlue,
    light: '#7E71E3',
    dark: '#261A83',
    contrastText: '#fff',
  },
  navy: {
    main: colors.navy,
    light: '#029AF2',
    dark: '#01304B',
    contrastText: '#fff',
  },
  aqua: {
    main: colors.aqua,
    light: 'rgb(131, 201, 215)',
    dark: 'rgb(70, 131, 143)',
    contrastText: 'rgba(0, 0, 0, 0.87)',
  },
  pear: {
    main: colors.pear,
    light: 'rgb(152, 191, 124)',
    dark: 'rgb(88, 122, 64)',
    contrastText: 'rgba(0, 0, 0, 0.87)',
  },
};

export type ThemeProps = ThemeOptions;

export const ThemeProvider = muiThemeProvider;

export function createTheme(props?: ThemeProps) {
  return muiCreateTheme({
    palette: {
      ...palette,
      primary: palette.navy,
    },
    components: {
      MuiButton: {
        defaultProps: {
          variant: 'contained',
        },
        styleOverrides: {
          root: {
            borderRadius: 0,
          },
        },
      },
      MuiAppBar: {
        defaultProps: {
          color: 'primary',
        },
      },
    },
    typography: {
      h1: {
        fontSize: '2.25rem',
      },
      h2: {
        fontSize: '2rem',
      },
      h3: {
        fontSize: '1.75rem',
      },
      h4: {
        fontSize: '1.5rem',
      },
      h5: {
        fontSize: '1.25rem',
      },
      h6: {
        fontSize: '1rem',
      },
    },
    ...props,
  });
}

/*
MUI doesn't expose the `augmentColor` function until you already have a theme, so the values
above were generated and copy-pasted

Generating augmented colors:
console.log(
  JSON.stringify(
    {
      lightGreen: theme.palette.augmentColor({ color: { main: '#FFDB01' } }),
      maximumBlue: theme.palette.augmentColor({ color: { main: '#A8BDCE' } }),
      mediumBlue: theme.palette.augmentColor({ color: { main: '#8869AE' } }),
      navy: theme.palette.augmentColor({ color: { main: '#2C4465' } }),
      aqua: theme.palette.augmentColor({ color: { main: '#65BCCD' } }),
      pear: theme.palette.augmentColor({ color: { main: '#7FAF5C' } }),
    }, null, 2
  )
);
*/
