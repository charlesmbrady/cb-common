import MuiDialogTitle from '@mui/material/DialogTitle';

export type DialogTitleProps = React.ComponentProps<typeof MuiDialogTitle>;

export function DialogTitle(props: DialogTitleProps) {
  return <MuiDialogTitle {...props} />;
}

export default DialogTitle;
