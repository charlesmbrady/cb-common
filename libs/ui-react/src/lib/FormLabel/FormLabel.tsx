import MuiFormLabel from '@mui/material/FormLabel';

export type FormLabelProps = React.ComponentProps<typeof MuiFormLabel>;

export function FormLabel(props: FormLabelProps) {
  return <MuiFormLabel data-test="form-label" {...props} />;
}

export default FormLabel;
