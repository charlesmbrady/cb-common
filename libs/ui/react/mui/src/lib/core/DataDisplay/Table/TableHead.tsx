// ui/mui/core/src/TableHead.tsx
import {
  TableHead as MUITableHead,
  TableHeadProps as MUITableHeadProps,
} from '@mui/material';

export type TableHeadProps = MUITableHeadProps;

export const TableHead = (props: TableHeadProps) => (
  <MUITableHead data-testid="tableHead" {...props} />
);
