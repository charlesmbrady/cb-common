import type { Meta, StoryObj } from '@storybook/react';
import { FeaturesHeader } from './FeaturesHeader';

const meta: Meta<typeof FeaturesHeader> = {
  title: 'Common/Features/FeaturesHeader',
  component: FeaturesHeader,
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
    title: 'Amazing Features',
    description:
      'Discover what makes our product special with these key capabilities.',
  },
};
