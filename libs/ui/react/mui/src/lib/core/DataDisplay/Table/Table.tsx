// ui/mui/core/src/Table.tsx
import { Table as MUITable, TableProps as MUITableProps } from '@mui/material';

export type TableProps = MUITableProps;

export const Table = (props: TableProps) => (
  <MUITable data-testid="table" {...props} />
);
