import type { Meta, StoryObj } from '@storybook/react';
import { PricingCommon } from './PricingCommon';
import { pricingTiers } from './pricingData';

const meta: Meta<typeof PricingCommon> = {
  title: 'Common/Pricing/PricingCommon',
  component: PricingCommon,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
    },
    description: {
      control: 'text',
    },
    tiers: {
      control: 'object',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomContent: Story = {
  args: {
    title: 'Choose Your Plan',
    description:
      'Select the perfect plan for your business needs. All plans include our core features with varying levels of support and storage.',
  },
};

export const TwoTiers: Story = {
  args: {
    title: 'Simple Pricing',
    description: 'Choose between our two main plans.',
    tiers: pricingTiers.slice(0, 2),
  },
};
