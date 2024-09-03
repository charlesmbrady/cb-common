import MuiPaper from '@mui/material/Paper';

export type PaperProps = React.ComponentProps<typeof MuiPaper>;

export function Paper(props: PaperProps) {
  return <MuiPaper {...props} />;
}

export default Paper;
