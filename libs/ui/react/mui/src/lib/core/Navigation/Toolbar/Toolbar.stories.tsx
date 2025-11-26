// Toolbar.stories.tsx
import type { Meta } from '@storybook/react';
import { Toolbar } from './Toolbar';

const meta: Meta<typeof Toolbar> = {
  title: 'Navigation/Toolbar',
  component: Toolbar,
};
export default meta;

export function ToolbarBase() {
  return <Toolbar>Toolbar Content</Toolbar>;
}
