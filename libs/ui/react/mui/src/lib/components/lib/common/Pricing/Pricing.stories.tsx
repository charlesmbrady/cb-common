import type { Meta, StoryObj } from '@storybook/react';
import Pricing from './Pricing';

const meta: Meta<typeof Pricing> = {
  title: 'Common/Pricing',
  component: Pricing,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
