import MuiTableRow from '@mui/material/TableRow';

export type TableRowProps = React.ComponentProps<typeof MuiTableRow>;

export function TableRow(props: TableRowProps) {
  return <MuiTableRow {...props} />;
}

export default TableRow;
