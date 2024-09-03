import type { Meta, StoryObj } from '@storybook/react';
import NavBarItem from './NavBarItem';

import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<typeof NavBarItem> = {
  component: NavBarItem,
  title: 'NavBarItem',
};
export default meta;
type Story = StoryObj<typeof NavBarItem>;

export const Primary: Story = {
  args: {
    label: 'Home',
    href: '/',
  },
};
