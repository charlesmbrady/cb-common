// Switch.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { Switch } from './Switch';
import { FormControlLabel } from '../Form/FormControlLabel';
import { Box } from '../../Layout/Box/Box';

const meta: Meta<typeof Switch> = {
  title: 'Inputs/Switch',
  component: Switch,
};
export default meta;
type Story = StoryObj<typeof Switch>;

export const SwitchBase: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const switchElement = await canvas.getByTestId('switch');
    await userEvent.click(switchElement);
    expect(switchElement).toBeVisible();
  },
};

export const SwitchWithLabel: Story = {
  render: () => (
    <FormControlLabel control={<Switch defaultChecked />} label="Label" />
  ),
};

export const SwitchVariants: Story = {
  render: () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <FormControlLabel control={<Switch />} label="Unchecked" />
      <FormControlLabel control={<Switch defaultChecked />} label="Checked" />
      <FormControlLabel control={<Switch disabled />} label="Disabled" />
      <FormControlLabel
        control={<Switch defaultChecked disabled />}
        label="Disabled Checked"
      />
    </Box>
  ),
};
