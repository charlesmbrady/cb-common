import MuiAlertTitle from '@mui/material/AlertTitle';

export type AlertTitleProps = React.ComponentProps<typeof MuiAlertTitle>;

export function AlertTitle(props: AlertTitleProps) {
  return <MuiAlertTitle {...props} />;
}

export default AlertTitle;
