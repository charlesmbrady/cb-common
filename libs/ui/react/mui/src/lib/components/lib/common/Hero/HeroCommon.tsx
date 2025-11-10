import * as React from 'react';
import { Stack } from '../../../../core';
import { HeroImage, HeroImageProps } from '../HeroImage';
import { HeroContainer } from './HeroContainer';
import { HeroItems } from './HeroItems';
import { HeroPrimaryText, HeroPrimaryTextProps } from './HeroPrimaryText';
import { HeroSecondaryText, HeroSecondaryTextProps } from './HeroSecondaryText';
import { HeroCaptionText, HeroCaptionTextProps } from './HeroCaptionText';

export type HeroCommonProps = {
  callToActionContent?: React.ReactNode;
  showImage?: boolean;
  heroImageProps?: HeroImageProps;
  primaryTextProps?: HeroPrimaryTextProps;
  secondaryTextProps?: HeroSecondaryTextProps;
  captionTextProps?: HeroCaptionTextProps;
};

export function HeroCommon({
  callToActionContent,
  showImage = false,
  heroImageProps,
  primaryTextProps,
  secondaryTextProps,
  captionTextProps,
}: HeroCommonProps) {
  const { lightBackgroundImage, darkBackgroundImage } = heroImageProps || {};
  const { mainText: primaryText, highlightedText: primaryHighlightedText } =
    primaryTextProps || {};
  const { text: secondaryText } = secondaryTextProps || {};
  const { text: captionText } = captionTextProps || {};
  return (
    <HeroContainer>
      <HeroItems>
        {primaryText && (
          <HeroPrimaryText
            mainText={primaryText}
            highlightedText={primaryHighlightedText}
          />
        )}
        {secondaryText && <HeroSecondaryText text={secondaryText} />}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          useFlexGap
          sx={{ pt: 2, width: { xs: '100%', sm: '350px' } }}
        >
          {callToActionContent}
        </Stack>
      </HeroItems>
      {captionText && <HeroCaptionText text={captionText} />}
      {showImage && (
        <HeroImage
          id="hero-image"
          lightBackgroundImage={lightBackgroundImage}
          darkBackgroundImage={darkBackgroundImage}
        />
      )}
    </HeroContainer>
  );
}
