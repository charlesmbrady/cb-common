import * as React from 'react';
import { Box } from '../../../../core';
import { FeatureCard, FeatureChip, FeatureItemData } from './FeatureCard';
import { FeatureImageDisplay } from './FeatureImageDisplay';

export type MobileLayoutProps = {
  selectedItemIndex: number;
  handleItemClick: (index: number) => void;
  selectedFeature: FeatureItemData;
  features: FeatureItemData[];
};

export function MobileLayout({
  selectedItemIndex,
  handleItemClick,
  selectedFeature,
  features,
}: MobileLayoutProps) {
  if (!features[selectedItemIndex]) {
    return null;
  }

  return (
    <Box
      sx={{
        display: { xs: 'flex', sm: 'none' },
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Box sx={{ display: 'flex', gap: 2, overflow: 'auto' }}>
        {features.map((feature, index) => (
          <FeatureChip
            key={index}
            feature={feature}
            selected={selectedItemIndex === index}
            onClick={() => handleItemClick(index)}
          />
        ))}
      </Box>
      <FeatureImageDisplay
        variant="mobile"
        imageLight={selectedFeature.imageLight}
        imageDark={selectedFeature.imageDark}
        title={selectedFeature.title}
        description={selectedFeature.description}
      />
    </Box>
  );
}
