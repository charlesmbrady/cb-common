import * as React from 'react';
import { Container, Box } from '../../../../core';
import { FeaturesHeader, FeaturesHeaderProps } from './FeaturesHeader';
import { FeatureCard, FeatureItemData } from './FeatureCard';
import { FeatureImageDisplay } from './FeatureImageDisplay';
import { MobileLayout } from './MobileLayout';
import { defaultFeatures } from './featuresData';

export type FeaturesCommonProps = {
  id?: string;
  headerProps?: FeaturesHeaderProps;
  features?: FeatureItemData[];
  defaultSelectedIndex?: number;
};

export function FeaturesCommon({
  id = 'features',
  headerProps,
  features = defaultFeatures,
  defaultSelectedIndex = 0,
}: FeaturesCommonProps) {
  const [selectedItemIndex, setSelectedItemIndex] =
    React.useState(defaultSelectedIndex);

  const handleItemClick = (index: number) => {
    setSelectedItemIndex(index);
  };

  const selectedFeature = features[selectedItemIndex];

  return (
    <Container id={id} sx={{ py: { xs: 8, sm: 16 } }}>
      <FeaturesHeader {...headerProps} />
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row-reverse' },
          gap: 2,
        }}
      >
        <div>
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              flexDirection: 'column',
              gap: 2,
              height: '100%',
            }}
          >
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                feature={feature}
                selected={selectedItemIndex === index}
                onClick={() => handleItemClick(index)}
              />
            ))}
          </Box>
          <MobileLayout
            selectedItemIndex={selectedItemIndex}
            handleItemClick={handleItemClick}
            selectedFeature={selectedFeature}
            features={features}
          />
        </div>
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            width: { xs: '100%', md: '70%' },
            height: 'var(--items-image-height)',
          }}
        >
          {selectedFeature && (
            <FeatureImageDisplay
              variant="desktop"
              imageLight={selectedFeature.imageLight}
              imageDark={selectedFeature.imageDark}
              title={selectedFeature.title}
              description={selectedFeature.description}
            />
          )}
        </Box>
      </Box>
    </Container>
  );
}
