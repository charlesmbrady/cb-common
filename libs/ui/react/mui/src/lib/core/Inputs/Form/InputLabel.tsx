// ui/mui/core/src/InputLabel.tsx
import {
  InputLabel as MUIInputLabel,
  InputLabelProps as MUIInputLabelProps,
} from '@mui/material';

export type InputLabelProps = MUIInputLabelProps;

export const InputLabel = (props: InputLabelProps) => (
  <MUIInputLabel data-testid="inputLabel" {...props} />
);
