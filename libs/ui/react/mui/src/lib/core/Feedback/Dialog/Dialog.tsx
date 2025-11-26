// ui/mui/core/src/Dialog.tsx
import {
  Dialog as MUIDialog,
  DialogProps as MuiDialogProps,
} from '@mui/material';

export type DialogProps = MuiDialogProps & {
  title: string;
};

export const Dialog = (props: DialogProps) => (
  <MUIDialog data-testid="dialog" {...props} />
);
