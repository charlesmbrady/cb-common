// ui/mui/core/src/DialogActions.tsx
import {
  DialogActions as MUIDialogActions,
  DialogActionsProps as MUIDialogActionsProps,
} from '@mui/material';

export type DialogActionsProps = MUIDialogActionsProps;

export const DialogActions = (props: DialogActionsProps) => (
  <MUIDialogActions data-testid="dialogActions" {...props} />
);
