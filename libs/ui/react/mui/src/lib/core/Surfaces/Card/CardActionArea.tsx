// ui/mui/core/src/CardActionArea.tsx
import {
  CardActionArea as MUICardActionArea,
  CardActionAreaProps as MUICardActionAreaProps,
} from '@mui/material';

export type CardActionAreaProps = MUICardActionAreaProps;

export const CardActionArea = (props: CardActionAreaProps) => (
  <MUICardActionArea data-testid="cardActionArea" {...props} />
);
