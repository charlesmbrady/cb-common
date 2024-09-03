import type { Meta, StoryObj } from '@storybook/react';
import { UiTailwind } from './ui-tailwind';

import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<typeof UiTailwind> = {
  component: UiTailwind,
  title: 'UiTailwind',
};
export default meta;
type Story = StoryObj<typeof UiTailwind>;

export const Primary = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Welcome to UiTailwind!/gi)).toBeTruthy();
  },
};
