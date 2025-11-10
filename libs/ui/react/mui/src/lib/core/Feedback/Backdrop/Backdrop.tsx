// ui/mui/core/src/Backdrop.tsx
import { Backdrop as MUIBackdrop, BackdropProps } from '@mui/material';
export const Backdrop = (props: BackdropProps) => (
  <MUIBackdrop data-testid="backdrop" {...props} />
);
