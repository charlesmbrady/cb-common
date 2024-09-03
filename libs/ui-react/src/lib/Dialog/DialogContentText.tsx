import MuiDialogContentText from '@mui/material/DialogContentText';

export type DialogContentTextProps = React.ComponentProps<typeof MuiDialogContentText>;

export function DialogContentText(props: DialogContentTextProps) {
  return <MuiDialogContentText {...props} />;
}

export default DialogContentText;
