import MuiAlert from '@mui/material/Alert';

export type AlertProps = React.ComponentProps<typeof MuiAlert>;

export function Alert(props: AlertProps) {
  return <MuiAlert {...props} />;
}

export default Alert;
