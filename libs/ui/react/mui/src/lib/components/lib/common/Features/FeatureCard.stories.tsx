import type { Meta, StoryObj } from '@storybook/react';
import { FeatureCard } from './FeatureCard';
import { defaultFeatures } from './featuresData';

const meta: Meta<typeof FeatureCard> = {
  title: 'Common/Features/FeatureCard',
  component: FeatureCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    feature: {
      control: 'object',
    },
    selected: {
      control: 'boolean',
    },
    onClick: {
      action: 'clicked',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    feature: defaultFeatures[0],
    selected: false,
  },
};

export const Selected: Story = {
  args: {
    feature: defaultFeatures[0],
    selected: true,
  },
};

export const SecondFeature: Story = {
  args: {
    feature: defaultFeatures[1],
    selected: false,
  },
};
