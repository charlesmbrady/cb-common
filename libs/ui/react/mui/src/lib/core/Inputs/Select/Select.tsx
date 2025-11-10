// ui/mui/core/src/Select.tsx
import {
  Select as MUISelect,
  SelectProps as MUISelectProps,
} from '@mui/material';

export type SelectProps = MUISelectProps;

export const Select = (props: SelectProps) => (
  <MUISelect data-testid="select" {...props} />
);
