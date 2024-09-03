import MuiContainer from '@mui/material/Container';

export type ContainerProps = React.ComponentProps<typeof MuiContainer>;

export function Container(props: ContainerProps) {
  return <MuiContainer {...props} />;
}

export default Container;
