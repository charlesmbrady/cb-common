// ui/mui/core/src/TableFooter.tsx
import {
  TableFooter as MUITableFooter,
  TableFooterProps as MUITableFooterProps,
} from '@mui/material';

export type TableFooterProps = MUITableFooterProps;

export const TableFooter = (props: TableFooterProps) => (
  <MUITableFooter data-testid="tableFooter" {...props} />
);
