// ui/mui/core/src/TableCell.tsx
import {
  TableCell as MUITableCell,
  TableCellProps as MUITableCellProps,
} from '@mui/material';

export type TableCellProps = MUITableCellProps;

export const TableCell = (props: TableCellProps) => (
  <MUITableCell data-testid="tableCell" {...props} />
);
