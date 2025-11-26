// ui/mui/core/src/AlertTitle.tsx
import {
  AlertTitle as MUIAlertTitle,
  AlertTitleProps as MuiAlertTitleProps,
} from '@mui/material';

export type AlertTitleProps = MuiAlertTitleProps;

export const AlertTitle = (props: AlertTitleProps) => (
  <MUIAlertTitle data-testid="alert-title" {...props} />
);
