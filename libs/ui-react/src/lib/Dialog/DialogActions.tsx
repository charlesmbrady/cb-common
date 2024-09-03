import MuiDialogActions from '@mui/material/DialogActions';

export type DialogActionsProps = React.ComponentProps<typeof MuiDialogActions>;

export function DialogActions(props: DialogActionsProps) {
  return <MuiDialogActions {...props} />;
}

export default DialogActions;
