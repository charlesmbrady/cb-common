// ui/mui/core/src/DialogContent.tsx
import {
  DialogContent as MUIDialogContent,
  DialogContentProps as MUIDialogContentProps,
} from '@mui/material';

export type DialogContentProps = MUIDialogContentProps;

export const DialogContent = (props: DialogContentProps) => (
  <MUIDialogContent data-testid="dialogContent" {...props} />
);
