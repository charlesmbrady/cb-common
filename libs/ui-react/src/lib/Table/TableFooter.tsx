import MuiTableFooter from '@mui/material/TableFooter';

export type TableFooterProps = React.ComponentProps<typeof MuiTableFooter>;

export function TableFooter(props: TableFooterProps) {
  return <MuiTableFooter {...props} />;
}

export default TableFooter;
