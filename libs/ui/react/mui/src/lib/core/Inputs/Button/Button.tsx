// ui/mui/core/src/Button.tsx
import { Button as MUIButton, ButtonProps } from '@mui/material';
export const Button = (props: ButtonProps) => (
  <MUIButton data-testid="button" {...props} />
);
