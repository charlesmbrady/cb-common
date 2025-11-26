import type { Meta, StoryObj } from '@storybook/react';
import { PricingHeader } from './PricingHeader';

const meta: Meta<typeof PricingHeader> = {
  title: 'Common/Pricing/PricingHeader',
  component: PricingHeader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
    },
    description: {
      control: 'text',
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
      'Select the perfect plan for your business needs with transparent pricing.',
  },
};
