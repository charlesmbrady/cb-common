// ui/mui/core/src/DialogContentText.tsx
import {
  DialogContentText as MUIDialogContentText,
  DialogContentTextProps as MUIDialogContentTextProps,
} from '@mui/material';

export type DialogContentTextProps = MUIDialogContentTextProps;

export const DialogContentText = (props: DialogContentTextProps) => (
  <MUIDialogContentText data-testid="dialogContentText" {...props} />
);
