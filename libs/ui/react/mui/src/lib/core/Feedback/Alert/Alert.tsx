// ui/mui/core/src/Alert.tsx
import { Alert as MUIAlert, AlertProps as MuiAlertProps } from '@mui/material';
import { AlertTitle } from './AlertTitle';

export type AlertProps = MuiAlertProps & {
  title: string;
};

export const Alert = (props: AlertProps) => (
  <MUIAlert data-testid="alert" {...props}>
    {props.title && <AlertTitle>{props.title}</AlertTitle>}
    {props.children}
  </MUIAlert>
);
