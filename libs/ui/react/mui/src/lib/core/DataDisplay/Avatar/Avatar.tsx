// ui/mui/core/src/Avatar.tsx
import { Avatar as MUIAvatar, AvatarProps } from '@mui/material';
export const Avatar = (props: AvatarProps) => (
  <MUIAvatar data-testid="avatar" {...props} />
);
