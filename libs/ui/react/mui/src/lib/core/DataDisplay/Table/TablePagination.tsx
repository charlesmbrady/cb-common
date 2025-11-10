// ui/mui/core/src/TablePagination.tsx
import {
  TablePagination as MUITablePagination,
  TablePaginationProps as MUITablePaginationProps,
} from '@mui/material';

export type TablePaginationProps = MUITablePaginationProps;

export const TablePagination = (props: TablePaginationProps) => (
  <MUITablePagination data-testid="tablePagination" {...props} />
);
