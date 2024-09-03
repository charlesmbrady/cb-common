import MuiTooltip from '@mui/material/Tooltip';

export type TooltipProps = React.ComponentProps<typeof MuiTooltip>;

export function Tooltip(props: TooltipProps) {
  return <MuiTooltip {...props} />;
}

export default Tooltip;
