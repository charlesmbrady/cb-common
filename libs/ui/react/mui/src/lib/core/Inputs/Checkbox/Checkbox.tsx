// ui/mui/core/src/Checkbox.tsx
import { Checkbox as MUICheckbox, CheckboxProps } from '@mui/material';
export const Checkbox = (props: CheckboxProps) => (
  <MUICheckbox data-testid="checkbox" {...props} />
);
