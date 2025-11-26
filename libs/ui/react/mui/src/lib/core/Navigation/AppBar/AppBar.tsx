// ui/mui/core/src/AppBar.tsx
import { AppBar as MUIAppBar, AppBarProps } from '@mui/material';
export const AppBar = (props: AppBarProps) => (
  <MUIAppBar data-testid="appBar" {...props} />
);
