import MuiGrid from '@mui/material/Grid';

export type GridProps = React.ComponentProps<typeof MuiGrid>;

export function Grid(props: GridProps) {
  return <MuiGrid {...props} />;
}

export default Grid;
