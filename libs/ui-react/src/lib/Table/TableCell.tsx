import MuiTableCell from '@mui/material/TableCell';

export type TableCellProps = React.ComponentProps<typeof MuiTableCell>;

export function TableCell(props: TableCellProps) {
  return <MuiTableCell {...props} />;
}

export default TableCell;
