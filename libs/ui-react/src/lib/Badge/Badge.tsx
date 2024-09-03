import MuiBadge from '@mui/material/Badge';

export type BadgeProps = React.ComponentProps<typeof MuiBadge>;

export function Badge(props: BadgeProps) {
  return <MuiBadge {...props} />;
}

export default Badge;
