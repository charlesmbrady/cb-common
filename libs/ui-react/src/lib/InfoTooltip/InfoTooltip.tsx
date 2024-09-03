import InfoIcon from '@mui/icons-material/Info';

import { Tooltip, TooltipProps } from '../Tooltip/Tooltip';

type IconProps = React.ComponentProps<typeof InfoIcon>;

export type InfoTooltipProps = Omit<TooltipProps, 'children'> & {
  color?: IconProps['color'];
  size?: IconProps['fontSize'];
  placement?:
    | 'bottom-end'
    | 'bottom-start'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top-end'
    | 'top-start'
    | 'top';
};

export function InfoTooltip(props: InfoTooltipProps) {
  const { color, size, ...tooltipProps } = props;
  return (
    <Tooltip {...tooltipProps}>
      <InfoIcon fontSize={size} color={color || 'info'} />
    </Tooltip>
  );
}

export default InfoTooltip;
