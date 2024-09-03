import MuiDivider from '@mui/material/Divider';

export type DividerProps = React.ComponentProps<typeof MuiDivider>;

export function Divider(props: DividerProps) {
  return <MuiDivider color="lightGreen" {...props} />;
}

export default Divider;
