// ui/mui/core/src/FormGroup.tsx
import {
  FormGroup as MUIFormGroup,
  FormGroupProps as MUIFormGroupProps,
} from '@mui/material';

export type FormGroupProps = MUIFormGroupProps;

export const FormGroup = (props: FormGroupProps) => (
  <MUIFormGroup data-testid="formGroup" {...props} />
);
