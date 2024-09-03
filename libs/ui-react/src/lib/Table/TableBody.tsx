import MuiTableBody from '@mui/material/TableBody';

export type TableBodyProps = React.ComponentProps<typeof MuiTableBody>;

export function TableBody(props: TableBodyProps) {
  return <MuiTableBody {...props} />;
}

export default TableBody;
