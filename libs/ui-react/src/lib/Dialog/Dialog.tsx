import MuiDialog from '@mui/material/Dialog';

export type DialogProps = React.ComponentProps<typeof MuiDialog>;

export function Dialog(props: DialogProps) {
  return <MuiDialog {...props} />;
}

export default Dialog;
