import type { Meta, StoryFn } from '@storybook/react';
import { HeroImage } from './HeroImage';

const meta: Meta<typeof HeroImage> = {
  component: HeroImage,
  title: 'Components/Common/HeroImage',
};
export default meta;

export const HeroImageBasic: StoryFn = () => {
  return <HeroImage />;
};
