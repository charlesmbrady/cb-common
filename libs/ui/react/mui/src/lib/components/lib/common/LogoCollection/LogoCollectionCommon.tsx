import * as React from 'react';
import { Box, Typography } from '../../../../core';
import Grid from '@mui/material/Grid';
import { useColorScheme } from '@mui/material/styles';

export type LogoItem = {
  lightSrc: string;
  darkSrc: string;
  alt: string;
};

export type LogoCollectionCommonProps = {
  id?: string;
  title?: string;
  logos?: LogoItem[];
  logoStyle?: React.CSSProperties;
};

const defaultLogos: LogoItem[] = [
  {
    lightSrc:
      'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/6560628889c3bdf1129952dc_Sydney-black.svg',
    darkSrc:
      'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/6560628e8573c43893fe0ace_Sydney-white.svg',
    alt: 'Sydney',
  },
  {
    lightSrc:
      'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f4d4d8b829a89976a419c_Bern-black.svg',
    darkSrc:
      'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f4d520d0517ae8e8ddf13_Bern-white.svg',
    alt: 'Bern',
  },
  {
    lightSrc:
      'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f467502f091ccb929529d_Montreal-black.svg',
    darkSrc:
      'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f46794c159024c1af6d44_Montreal-white.svg',
    alt: 'Montreal',
  },
  {
    lightSrc:
      'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/61f12e911fa22f2203d7514c_TerraDark.svg',
    darkSrc:
      'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/61f12e891fa22f89efd7477a_TerraLight.svg',
    alt: 'Terra',
  },
  {
    lightSrc:
      'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/6560a0990f3717787fd49245_colorado-black.svg',
    darkSrc:
      'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/6560a09d1f6337b1dfed14ab_colorado-white.svg',
    alt: 'Colorado',
  },
  {
    lightSrc:
      'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f5ca4e548b0deb1041c33_Ankara-black.svg',
    darkSrc:
      'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f5caa77bf7d69fb78792e_Ankara-white.svg',
    alt: 'Ankara',
  },
];

const defaultLogoStyle: React.CSSProperties = {
  width: '100px',
  height: '80px',
  margin: '0 32px',
  opacity: 0.7,
};

export function LogoCollectionCommon({
  id = 'logoCollection',
  title = 'Trusted by the best companies',
  logos = defaultLogos,
  logoStyle = defaultLogoStyle,
}: LogoCollectionCommonProps) {
  const { mode, systemMode } = useColorScheme();

  const getLogoSrc = (logo: LogoItem) => {
    if (mode === 'system') {
      return systemMode === 'light' ? logo.lightSrc : logo.darkSrc;
    }
    return mode === 'light' ? logo.lightSrc : logo.darkSrc;
  };

  return (
    <Box id={id} sx={{ py: 4 }}>
      <Typography
        component="p"
        variant="subtitle2"
        align="center"
        sx={{ color: 'text.secondary' }}
      >
        {title}
      </Typography>
      <Grid container sx={{ justifyContent: 'center', mt: 0.5, opacity: 0.6 }}>
        {logos.map((logo, index) => (
          <Grid key={index}>
            <img src={getLogoSrc(logo)} alt={logo.alt} style={logoStyle} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
