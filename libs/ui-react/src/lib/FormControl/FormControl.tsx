import MuiFormControl from '@mui/material/FormControl';

export type FormControlProps = React.ComponentProps<typeof MuiFormControl>;

export function FormControl(props: FormControlProps) {
  return <MuiFormControl {...props} />;
}

export default FormControl;
