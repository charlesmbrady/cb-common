// ui/mui/core/src/FormHelperText.tsx
import {
  FormHelperText as MUIFormHelperText,
  FormHelperTextProps as MUIFormHelperTextProps,
} from '@mui/material';

export type FormHelperTextProps = MUIFormHelperTextProps;

export const FormHelperText = (props: FormHelperTextProps) => (
  <MUIFormHelperText data-testid="formHelperText" {...props} />
);
