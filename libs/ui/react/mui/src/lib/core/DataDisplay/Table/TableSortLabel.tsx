// ui/mui/core/src/TableSortLabel.tsx
import {
  TableSortLabel as MUITableSortLabel,
  TableSortLabelProps as MUITableSortLabelProps,
} from '@mui/material';

export type TableSortLabelProps = MUITableSortLabelProps;

export const TableSortLabel = (props: TableSortLabelProps) => (
  <MUITableSortLabel data-testid="tableSortLabel" {...props} />
);
