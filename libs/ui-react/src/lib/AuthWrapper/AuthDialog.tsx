import { Dialog, DialogProps, DialogTitle, DialogContent, DialogContentText, DialogActions } from '../Dialog';

import { Button } from '../Button/Button';

function redirectToWebsite() {
  window.location.replace('https://curi.com');
}

export function AuthDialog(props: DialogProps) {
  return (
    <Dialog {...props}>
      <DialogTitle color="primary">Unauthorized</DialogTitle>
      <DialogContent>
        <DialogContentText variant="body1" gutterBottom>
          The account you are signed in with does not have access to this content.
        </DialogContentText>
        <DialogContentText variant="body1">
          <a href="https://curi.com/contact/">Contact us</a> if you believe this is an error. Otherwise, click "Close"
          below to return to the Curi website.
        </DialogContentText>
        <DialogActions>
          <Button onClick={redirectToWebsite}>Close</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}

export default AuthDialog;
