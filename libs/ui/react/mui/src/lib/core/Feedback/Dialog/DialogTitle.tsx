// ui/mui/core/src/DialogTitle.tsx
import {
  DialogTitle as MUIDialogTitle,
  DialogTitleProps as MUIDialogTitleProps,
} from '@mui/material';

export type DialogTitleProps = MUIDialogTitleProps;

export const DialogTitle = (props: DialogTitleProps) => (
  <MUIDialogTitle data-testid="dialogTitle" {...props} />
);
