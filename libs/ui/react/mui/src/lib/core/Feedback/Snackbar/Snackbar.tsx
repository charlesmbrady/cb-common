// ui/mui/core/src/Snackbar.tsx
import { Snackbar as MUISnackbar, SnackbarProps } from '@mui/material';
export const Snackbar = (props: SnackbarProps) => (
  <MUISnackbar data-testid="snackbar" {...props} />
);
