// Chip.stories.tsx
import type { Meta, StoryFn } from '@storybook/react';
import MailIcon from '@mui/icons-material/Mail';
import { Chip } from './Chip';
import { Stack } from '../../Layout/Stack/Stack';
import { Avatar } from '../Avatar/Avatar';

const meta: Meta<typeof Chip> = {
  title: 'Data Display/Chip',
  component: Chip,
};
export default meta;

export const ChipVariants: StoryFn = () => (
  <Stack spacing={2}>
    <Stack direction="row" spacing={1}>
      <Chip label="Chip Filled" />
      <Chip label="Chip Outlined" variant="outlined" />
    </Stack>
    <Stack direction="row" spacing={1}>
      <Chip label="Chip with Icon" icon={<MailIcon />} />
      <Chip
        label="Outlined Chip with Icon"
        variant="outlined"
        icon={<MailIcon />}
      />
    </Stack>

    <Stack direction="row" spacing={1}>
      <Chip label="Chip with Avatar" avatar={<Avatar />} />
      <Chip
        label="Outlined Chip with Avatar"
        variant="outlined"
        avatar={<Avatar />}
      />
    </Stack>
    <Stack direction="row" spacing={1}>
      <Chip
        label="Clickable Chip"
        clickable
        onClick={() => alert('Chip clicked!')}
      />
      <Chip
        label="Outlined Clickable Chip"
        variant="outlined"
        clickable
        onClick={() => alert('Outlined Chip clicked!')}
      />
    </Stack>
  </Stack>
);
