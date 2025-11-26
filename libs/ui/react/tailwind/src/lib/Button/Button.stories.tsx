// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Core/Button',
  component: Button,
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Clickable: Story = {
  args: { children: 'Click me' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const btn = await canvas.getByRole('button');
    await userEvent.click(btn);
    expect(btn).toBeVisible();
  },
};
