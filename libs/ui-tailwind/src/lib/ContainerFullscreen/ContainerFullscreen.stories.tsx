import type { Meta, StoryObj } from '@storybook/react';
import ContainerFullscreen from './ContainerFullscreen';

import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<typeof ContainerFullscreen> = {
  component: ContainerFullscreen,
  title: 'ContainerFullscreen',
};
export default meta;
type Story = StoryObj<typeof ContainerFullscreen>;

export const Primary: Story = {
  args: {},
};
