// ui/mui/core/src/FormLabel.tsx
import {
  FormLabel as MUIFormLabel,
  FormLabelProps as MUIFormLabelProps,
} from '@mui/material';

export type FormLabelProps = MUIFormLabelProps;

export const FormLabel = (props: FormLabelProps) => (
  <MUIFormLabel data-testid="formLabel" {...props} />
);
