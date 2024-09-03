import MuiAvatar from '@mui/material/Avatar';

export type AvatarProps = React.ComponentProps<typeof MuiAvatar>;

export function Avatar(props: AvatarProps) {
  return <MuiAvatar {...props} />;
}

export default Avatar;
