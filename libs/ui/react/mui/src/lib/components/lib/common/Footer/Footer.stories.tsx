import type { Meta, StoryObj } from '@storybook/react';
import Footer from './Footer';

const meta: Meta<typeof Footer> = {
  title: 'Common/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
