import MuiAvatarGroup from '@mui/material/AvatarGroup';

export type AvatarGroupProps = React.ComponentProps<typeof MuiAvatarGroup>;

export function AvatarGroup(props: AvatarGroupProps) {
  return <MuiAvatarGroup {...props} />;
}

export default AvatarGroup;
