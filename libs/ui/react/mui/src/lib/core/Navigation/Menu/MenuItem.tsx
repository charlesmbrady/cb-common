// ui/mui/core/src/MenuItem.tsx
import { MenuItem as MUIMenuItem, MenuItemProps } from '@mui/material';
export const MenuItem = (props: MenuItemProps) => (
  <MUIMenuItem data-testid="menuItem" {...props} />
);
