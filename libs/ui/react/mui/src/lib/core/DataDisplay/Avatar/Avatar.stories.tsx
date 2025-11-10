// Avatar.stories.tsx
import type { Meta, StoryFn } from '@storybook/react';
import { Stack } from '../../Layout/Stack/Stack';
import { Avatar } from './Avatar';
import { deepOrange, deepPurple } from '@mui/material/colors';

const meta: Meta<typeof Avatar> = {
  title: 'Data Display/Avatar',
  component: Avatar,
};
export default meta;

export const AvatarVariants: StoryFn = () => (
  <Stack direction="row" spacing={2}>
    <Avatar>H</Avatar>
    <Avatar sx={{ bgcolor: deepOrange[500] }}>N</Avatar>
    <Avatar sx={{ bgcolor: deepPurple[500] }}>OP</Avatar>
  </Stack>
);
