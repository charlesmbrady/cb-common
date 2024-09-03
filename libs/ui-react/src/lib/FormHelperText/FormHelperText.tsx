import MuiFormHelperText from '@mui/material/FormHelperText';

export type FormHelperTextProps = React.ComponentProps<
  typeof MuiFormHelperText
>;

export function FormHelperText(props: FormHelperTextProps) {
  return <MuiFormHelperText data-test="form-helper-text" {...props} />;
}

export default FormHelperText;
