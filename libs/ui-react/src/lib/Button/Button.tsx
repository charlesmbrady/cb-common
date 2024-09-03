import MuiButton, { ButtonProps as MuiButtonProps } from '@mui/material/Button';

export type ButtonProps = MuiButtonProps;

export function Button(props: ButtonProps) {
  return <MuiButton data-test="button" {...props} />;
}

export default Button;
