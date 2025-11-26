// TextField.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { TextField } from './TextField';
import { Box } from '../../Layout/Box/Box';

const meta: Meta<typeof TextField> = {
  title: 'Inputs/TextField',
  component: TextField,
};
export default meta;
type Story = StoryObj<typeof TextField>;

export const TextFieldBase: Story = {
  args: { variant: 'outlined', label: 'Enter text' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const el = await canvas.getByTestId('textField');
    await userEvent.click(el);
    expect(el).toBeVisible();
  },
};

export function BasicTextFields() {
  return (
    <Box
      component="form"
      sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
      // noValidate
      // autoComplete="off"
    >
      <TextField id="outlined-basic" label="Outlined" variant="outlined" />
      <TextField id="filled-basic" label="Filled" variant="filled" />
      <TextField id="standard-basic" label="Standard" variant="standard" />
    </Box>
  );
}
