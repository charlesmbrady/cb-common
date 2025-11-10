import * as React from 'react';
import { styled } from '@mui/material/styles';

export type HeroImageProps = {
  lightBackgroundImage?: string;
  darkBackgroundImage?: string;
  id?: string;
};

type StyledBoxProps = {
  lightBackgroundImage: string;
  darkBackgroundImage: string;
};

const StyledBox = styled('div')<StyledBoxProps>(
  ({ theme, lightBackgroundImage, darkBackgroundImage }) => ({
    alignSelf: 'center',
    width: '100%',
    height: 400,
    marginTop: theme.spacing(8),
    borderRadius: (theme.vars || theme).shape.borderRadius,
    outline: '6px solid',
    outlineColor: 'hsla(220, 25%, 80%, 0.2)',
    border: '1px solid',
    borderColor: (theme.vars || theme).palette.grey[200],
    boxShadow: '0 0 12px 8px hsla(220, 25%, 80%, 0.2)',
    backgroundImage: `url(${lightBackgroundImage})`,
    backgroundSize: 'cover',
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(10),
      height: 700,
    },
    ...theme.applyStyles('dark', {
      boxShadow: '0 0 24px 12px hsla(210, 100%, 25%, 0.2)',
      backgroundImage: `url(${darkBackgroundImage || lightBackgroundImage})`,
      outlineColor: 'hsla(220, 20%, 42%, 0.1)',
      borderColor: (theme.vars || theme).palette.grey[700],
    }),
  })
);

export function HeroImage({
  lightBackgroundImage = 'https://mui.com/static/screenshots/material-ui/getting-started/templates/dashboard.jpg',
  darkBackgroundImage = 'https://mui.com/static/screenshots/material-ui/getting-started/templates/dashboard-dark.jpg',
  id = 'hero-image',
}: HeroImageProps) {
  return (
    <StyledBox
      id={id}
      lightBackgroundImage={lightBackgroundImage}
      darkBackgroundImage={darkBackgroundImage}
    />
  );
}
