// Stack.stories.tsx
import type { Meta, StoryFn } from '@storybook/react';
import { Stack } from './Stack';
import { Paper } from '../../Surfaces/Paper/Paper';
import { styled } from '@mui/material/styles';

const meta: Meta<typeof Stack> = {
  title: 'Layout/Stack',
  component: Stack,
};
export default meta;

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

export const StackBasic: StoryFn = () => (
  <Stack spacing={2}>
    <Item>Item 1</Item>
    <Item>Item 2</Item>
    <Item>Item 3</Item>
  </Stack>
);

export const StackHorizontal: StoryFn = () => (
  <Stack direction="row" spacing={2}>
    <Item>Item 1</Item>
    <Item>Item 2</Item>
    <Item>Item 3</Item>
  </Stack>
);
