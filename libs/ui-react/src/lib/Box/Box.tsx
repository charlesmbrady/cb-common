import MuiBox from '@mui/material/Box';

export type BoxProps = React.ComponentProps<typeof MuiBox>;

export function Box(props: BoxProps) {
  return <MuiBox {...props} />;
}

export default Box;
