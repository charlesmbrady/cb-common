import type { Meta, StoryObj } from '@storybook/react';
import { HighlightCard } from './HighlightCard';
import { defaultHighlights } from './highlightsData';

const meta: Meta<typeof HighlightCard> = {
  title: 'Common/Highlights/HighlightCard',
  component: HighlightCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    item: {
      control: 'object',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    item: defaultHighlights[0],
  },
};

export const Performance: Story = {
  args: {
    item: defaultHighlights[0],
  },
};

export const Construction: Story = {
  args: {
    item: defaultHighlights[1],
  },
};

export const Stats: Story = {
  args: {
    item: defaultHighlights[2],
  },
};
