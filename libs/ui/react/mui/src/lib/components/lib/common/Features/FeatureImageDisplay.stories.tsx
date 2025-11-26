import type { Meta, StoryObj } from '@storybook/react';
import { FeatureImageDisplay } from './FeatureImageDisplay';
import { defaultFeatures } from './featuresData';

const meta: Meta<typeof FeatureImageDisplay> = {
  title: 'Common/Features/FeatureImageDisplay',
  component: FeatureImageDisplay,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    imageLight: {
      control: 'text',
    },
    imageDark: {
      control: 'text',
    },
    title: {
      control: 'text',
    },
    description: {
      control: 'text',
    },
    variant: {
      control: 'select',
      options: ['desktop', 'mobile'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    imageLight: defaultFeatures[0].imageLight,
    imageDark: defaultFeatures[0].imageDark,
    title: defaultFeatures[0].title,
    description: defaultFeatures[0].description,
    variant: 'desktop',
  },
};

export const Mobile: Story = {
  args: {
    imageLight: defaultFeatures[0].imageLight,
    imageDark: defaultFeatures[0].imageDark,
    title: defaultFeatures[0].title,
    description: defaultFeatures[0].description,
    variant: 'mobile',
  },
};
