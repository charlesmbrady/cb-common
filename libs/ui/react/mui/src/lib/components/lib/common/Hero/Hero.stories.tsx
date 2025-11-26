import type { Meta, StoryFn } from '@storybook/react';
import { visuallyHidden } from '@mui/utils';
import { HeroCommon } from './HeroCommon';
import { Button, TextField, InputLabel } from '../../../../core';

const meta: Meta<typeof HeroCommon> = {
  component: HeroCommon,
  title: 'Components/Common/HeroCommon',
};
export default meta;

export const HeroCommonBasic: StoryFn = () => {
  return <HeroCommon />;
};

export const HeroCommonWithImage: StoryFn = () => {
  return <HeroCommon showImage />;
};

export const HeroCommonMarketing: StoryFn = ({
  image = true,
  lightBackgroundImage,
  darkBackgroundImage,
}) => {
  return (
    <HeroCommon
      showImage={image || false}
      heroImageProps={{
        lightBackgroundImage:
          lightBackgroundImage ||
          'https://mui.com/static/screenshots/material-ui/getting-started/templates/dashboard.jpg',
        darkBackgroundImage:
          darkBackgroundImage ||
          'https://mui.com/static/screenshots/material-ui/getting-started/templates/dashboard-dark.jpg',
      }}
      primaryTextProps={{
        mainText: 'Our latest ',
        highlightedText: 'products',
      }}
      secondaryTextProps={{
        text: 'Explore our cutting-edge dashboard, delivering high-quality solutions tailored to your needs. Elevate your experience with top-tier features and services.',
      }}
      callToActionContent={
        <>
          <InputLabel htmlFor="email-hero" sx={visuallyHidden}>
            Email
          </InputLabel>
          <TextField
            id="email-hero"
            hiddenLabel
            size="small"
            variant="outlined"
            aria-label="Enter your email address"
            placeholder="Your email address"
            fullWidth
            slotProps={{
              htmlInput: {
                autoComplete: 'off',
                'aria-label': 'Enter your email address',
              },
            }}
          />
          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={{ minWidth: 'fit-content' }}
          >
            Start now
          </Button>
        </>
      }
      captionTextProps={{
        text: 'By clicking "Start now" you agree to our Terms & Conditions.',
      }}
    />
  );
};
