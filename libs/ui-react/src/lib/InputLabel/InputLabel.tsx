import MuiInputLabel from '@mui/material/InputLabel';

export type InputLabelProps = React.ComponentProps<typeof MuiInputLabel>;

export function InputLabel(props: InputLabelProps) {
  return <MuiInputLabel {...props} />;
}

export default InputLabel;
