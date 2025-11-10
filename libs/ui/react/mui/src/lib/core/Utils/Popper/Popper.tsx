// ui/mui/core/src/Popper.tsx
import { Popper as MUIPopper, PopperProps } from '@mui/material';
export const Popper = (props: PopperProps) => (
  <MUIPopper data-testid="popper" {...props} />
);
