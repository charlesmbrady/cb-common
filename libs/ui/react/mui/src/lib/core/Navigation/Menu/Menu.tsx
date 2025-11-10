// ui/mui/core/src/Menu.tsx
import { Menu as MUIMenu, MenuProps } from '@mui/material';
export const Menu = (props: MenuProps) => (
  <MUIMenu data-testid="menu" {...props} />
);
