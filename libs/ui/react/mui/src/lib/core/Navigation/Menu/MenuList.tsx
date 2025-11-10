// ui/mui/core/src/MenuList.tsx
import { MenuList as MUIMenuList, MenuListProps } from '@mui/material';
export const MenuList = (props: MenuListProps) => (
  <MUIMenuList data-testid="menuList" {...props} />
);
