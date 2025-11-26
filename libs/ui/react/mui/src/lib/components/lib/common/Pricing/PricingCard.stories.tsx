import type { Meta, StoryObj } from '@storybook/react';
import { PricingCard } from './PricingCard';
import { pricingTiers } from './pricingData';

const meta: Meta<typeof PricingCard> = {
  title: 'Common/Pricing/PricingCard',
  component: PricingCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    tier: {
      control: 'object',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Free: Story = {
  args: {
    tier: pricingTiers[0],
  },
};

export const Professional: Story = {
  args: {
    tier: pricingTiers[1],
  },
};

export const Enterprise: Story = {
  args: {
    tier: pricingTiers[2],
  },
};
