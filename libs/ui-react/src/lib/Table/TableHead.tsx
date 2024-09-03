import MuiTableHead from '@mui/material/TableHead';

export type TableHeadProps = React.ComponentProps<typeof MuiTableHead>;

export function TableHead(props: TableHeadProps) {
  return <MuiTableHead {...props} />;
}

export default TableHead;
