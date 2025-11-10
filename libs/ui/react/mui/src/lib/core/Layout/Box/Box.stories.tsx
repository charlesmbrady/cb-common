// Box.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { Box } from './Box';

const meta: Meta<typeof Box> = {
  title: 'Layout/Box',
  component: Box,
};
export default meta;
type Story = StoryObj<typeof Box>;

export const BoxBase: Story = {
  args: {
    children: 'Inside Box',
    style: { border: '1px solid black' },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const box = canvas.getByTestId('box');
    await expect(box).toBeInTheDocument();
  },
};
