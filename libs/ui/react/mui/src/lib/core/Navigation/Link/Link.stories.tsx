// Link.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { Link } from './Link';

const meta: Meta<typeof Link> = {
  title: 'Navigation/Link',
  component: Link,
};
export default meta;
type Story = StoryObj<typeof Link>;

export const LinkBase: Story = {
  args: { children: 'Click me' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const btn = await canvas.getByTestId('link');
    await userEvent.click(btn);
    expect(btn).toBeVisible();
  },
};
