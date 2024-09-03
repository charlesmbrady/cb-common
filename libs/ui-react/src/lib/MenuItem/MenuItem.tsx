import MuiMenuItem from '@mui/material/MenuItem';

export type MenuItemProps = React.ComponentProps<typeof MuiMenuItem>;

export function MenuItem(props: MenuItemProps) {
  return <MuiMenuItem {...props} />;
}

export default MenuItem;
