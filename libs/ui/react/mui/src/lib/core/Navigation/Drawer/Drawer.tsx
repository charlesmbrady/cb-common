// ui/mui/core/src/Drawer.tsx
import { Drawer as MUIDrawer, DrawerProps } from '@mui/material';
export const Drawer = (props: DrawerProps) => (
  <MUIDrawer data-testid="drawer" {...props} />
);
