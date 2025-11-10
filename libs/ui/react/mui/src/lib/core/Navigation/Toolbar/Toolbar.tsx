// ui/mui/core/src/Toolbar.tsx
import { Toolbar as MUIToolbar, ToolbarProps } from '@mui/material';
export const Toolbar = (props: ToolbarProps) => (
  <MUIToolbar data-testid="toolbar" {...props} />
);
