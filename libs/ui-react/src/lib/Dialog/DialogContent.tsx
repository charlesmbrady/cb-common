import MuiDialogContent from '@mui/material/DialogContent';

export type DialogContentProps = React.ComponentProps<typeof MuiDialogContent>;

export function DialogContent(props: DialogContentProps) {
  return <MuiDialogContent {...props} />;
}

export default DialogContent;
