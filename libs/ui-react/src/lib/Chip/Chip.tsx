import MuiChip from '@mui/material/Chip';

export type ChipProps = React.ComponentProps<typeof MuiChip>;

export function Chip(props: ChipProps) {
  return <MuiChip {...props} />;
}

export default Chip;
