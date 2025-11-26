import type { Meta, StoryObj } from '@storybook/react';
import { HighlightsGrid } from './HighlightsGrid';
import { defaultHighlights } from './highlightsData';

const meta: Meta<typeof HighlightsGrid> = {
  title: 'Common/Highlights/HighlightsGrid',
  component: HighlightsGrid,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    items: {
      control: 'object',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: defaultHighlights,
  },
};

export const ThreeItems: Story = {
  args: {
    items: defaultHighlights.slice(0, 3),
  },
};

export const TwoItems: Story = {
  args: {
    items: defaultHighlights.slice(0, 2),
  },
};
