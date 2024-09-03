import MuiDrawer, { DrawerProps as MuiDrawerProps } from '@mui/material/Drawer';

export type DrawerProps = MuiDrawerProps;

export function Drawer(props: DrawerProps) {
  return (
    <MuiDrawer data-test="drawer" {...props}>
      {props.children}
    </MuiDrawer>
  );
}

export default Drawer;
