import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export type FullScreenLoaderProps = {
  open: boolean;
};

// TODO make this more robust as required in the future
export function FullScreenLoader({ open }: { open: boolean }) {
  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}

export default FullScreenLoader;
