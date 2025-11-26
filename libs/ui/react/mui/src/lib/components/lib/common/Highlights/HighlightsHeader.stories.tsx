import type { Meta, StoryObj } from '@storybook/react';
import { HighlightsHeader } from './HighlightsHeader';

const meta: Meta<typeof HighlightsHeader> = {
  title: 'Common/Highlights/HighlightsHeader',
  component: HighlightsHeader,
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
    textAlign: {
      control: 'select',
      options: ['left', 'center', 'right'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomContent: Story = {
  args: {
    title: 'Key Benefits',
    description:
      'Discover what makes our solution the best choice for your needs.',
    textAlign: 'left',
  },
};
