// ui/mui/core/src/FormControlLabel.tsx
import {
  FormControlLabel as MUIFormControlLabel,
  FormControlLabelProps as MUIFormControlLabelProps,
} from '@mui/material';

export type FormControlLabelProps = MUIFormControlLabelProps;

export const FormControlLabel = (props: FormControlLabelProps) => (
  <MUIFormControlLabel data-testid="formControlLabel" {...props} />
);
