import MuiFormControlLabel, {
  FormControlLabelProps as MuiFormControlLabelProps,
} from '@mui/material/FormControlLabel';

export type FormControlLabelProps = MuiFormControlLabelProps;

export function FormControlLabel(props: FormControlLabelProps) {
  return <MuiFormControlLabel data-test="form-control-label" {...props} />;
}

export default FormControlLabel;
