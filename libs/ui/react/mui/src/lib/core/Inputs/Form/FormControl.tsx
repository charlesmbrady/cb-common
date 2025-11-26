// ui/mui/core/src/FormControl.tsx
import {
  FormControl as MUIFormControl,
  FormControlProps as MUIFormControlProps,
} from '@mui/material';

export type FormControlProps = MUIFormControlProps;

export const FormControl = (props: FormControlProps) => (
  <MUIFormControl data-testid="formControl" {...props} />
);
