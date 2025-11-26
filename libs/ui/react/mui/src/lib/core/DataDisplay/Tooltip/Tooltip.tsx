// ui/mui/core/src/Tooltip.tsx
import { Tooltip as MUITooltip, TooltipProps } from '@mui/material';
export const Tooltip = (props: TooltipProps) => (
  <MUITooltip data-testid="tooltip" {...props} />
);
