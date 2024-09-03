import { useState } from 'react';
import MuiSnackbar, { SnackbarProps as MuiSnackbarProps } from '@mui/material/Snackbar';
import Alert from '../Alert/Alert';
import { AlertTitle } from '../Alert';

export type SnackbarProps = Omit<MuiSnackbarProps, 'onClose' | 'message'> & {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
};

export function Snackbar({ open, type, message, ...props }: SnackbarProps) {
  const [isOpen, setIsOpen] = useState(open);

  return (
    <MuiSnackbar
      open={isOpen}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      onClose={() => setIsOpen(false)}
      ClickAwayListenerProps={{
        // this is set here to prevent users from being able to clickaway the toast
        // potentially should add a prop to allow modifying this
        onClickAway: () => {},
      }}
      autoHideDuration={type === 'error' ? null : 10000}
      sx={{ width: '350px' }}
      {...props}
    >
      {/* Had to wrap in <div> to avoid 'scrollTop' error for Alert */}
      <div>
        <Alert severity={type} onClose={() => setIsOpen(false)}>
          <AlertTitle sx={{ textTransform: 'capitalize' }}>{type}</AlertTitle>
          {message}
        </Alert>
      </div>
    </MuiSnackbar>
  );
}

export default Snackbar;
