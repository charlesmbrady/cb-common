import type { Meta, StoryObj } from '@storybook/react';
import LogoCollection from './LogoCollection';

const meta: Meta<typeof LogoCollection> = {
  title: 'Common/LogoCollection',
  component: LogoCollection,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
