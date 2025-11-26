// ui/mui/core/src/TextField.tsx
import { TextField as MUITextField, TextFieldProps } from '@mui/material';
export const TextField = (props: TextFieldProps) => (
  <MUITextField data-testid="textField" {...props} />
);
