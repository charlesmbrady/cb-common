import type { Meta, StoryObj } from '@storybook/react';
import { PricingGrid } from './PricingGrid';
import { pricingTiers } from './pricingData';

const meta: Meta<typeof PricingGrid> = {
  title: 'Common/Pricing/PricingGrid',
  component: PricingGrid,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    tiers: {
      control: 'object',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    tiers: pricingTiers,
  },
};

export const TwoTiers: Story = {
  args: {
    tiers: pricingTiers.slice(0, 2),
  },
};
