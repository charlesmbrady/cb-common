// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Inputs/Button',
  component: Button,
};
export default meta;
type Story = StoryObj<typeof Button>;

export const ButtonBase: Story = {
  args: { children: 'Click me' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const btn = await canvas.getByTestId('button');
    await userEvent.click(btn);
    expect(btn).toBeVisible();
  },
};
