// ui/mui/core/src/TableBody.tsx
import {
  TableBody as MUITableBody,
  TableBodyProps as MUITableBodyProps,
} from '@mui/material';

export type TableBodyProps = MUITableBodyProps;

export const TableBody = (props: TableBodyProps) => (
  <MUITableBody data-testid="tableBody" {...props} />
);
