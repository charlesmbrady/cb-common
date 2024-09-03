import MuiStack from '@mui/material/Stack';

export type StackProps = React.ComponentProps<typeof MuiStack>;

export function Stack(props: StackProps) {
  return <MuiStack {...props} />;
}

export default Stack;
