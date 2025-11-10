// ui/mui/core/src/TableRow.tsx
import {
  TableRow as MUITableRow,
  TableRowProps as MUITableRowProps,
} from '@mui/material';

export type TableRowProps = MUITableRowProps;

export const TableRow = (props: TableRowProps) => (
  <MUITableRow data-testid="tableRow" {...props} />
);
