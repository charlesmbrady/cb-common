import type { Meta, StoryObj } from '@storybook/react';
import { HighlightsCommon } from './HighlightsCommon';
import { defaultHighlights } from './highlightsData';

const meta: Meta<typeof HighlightsCommon> = {
  title: 'Common/Highlights/HighlightsCommon',
  component: HighlightsCommon,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    headerProps: {
      control: 'object',
    },
    gridProps: {
      control: 'object',
    },
    backgroundColor: {
      control: 'color',
    },
    textColor: {
      control: 'color',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomContent: Story = {
  args: {
    headerProps: {
      title: 'Key Benefits',
      description:
        'Discover the advantages that set our product apart from the competition.',
    },
  },
};

export const FewHighlights: Story = {
  args: {
    headerProps: {
      title: 'Top Features',
      description: 'Our most important capabilities.',
    },
    gridProps: {
      items: defaultHighlights.slice(0, 3),
    },
  },
};
