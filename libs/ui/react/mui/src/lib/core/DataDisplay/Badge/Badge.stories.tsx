// Badge.stories.tsx
import type { Meta, StoryFn } from '@storybook/react';
import MailIcon from '@mui/icons-material/Mail';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'Data Display/Badge',
  component: Badge,
};
export default meta;

export const BadgeVariants: StoryFn = () => (
  <Badge badgeContent={4} color="primary">
    <MailIcon color="action" />
  </Badge>
);
