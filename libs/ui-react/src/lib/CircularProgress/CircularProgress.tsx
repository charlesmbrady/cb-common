import MuiCircularProgress from '@mui/material/CircularProgress';

export type CircularProgressProps = React.ComponentProps<typeof MuiCircularProgress>;

export function CircularProgress(props: CircularProgressProps) {
  return <MuiCircularProgress {...props} />;
}

export default CircularProgress;
