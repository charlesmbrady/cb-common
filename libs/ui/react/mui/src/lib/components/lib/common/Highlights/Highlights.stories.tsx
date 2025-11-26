import type { Meta, StoryObj } from '@storybook/react';
import Highlights from './Highlights';

const meta: Meta<typeof Highlights> = {
  title: 'Common/Highlights',
  component: Highlights,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
