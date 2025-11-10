// ui/mui/core/src/CardMedia.tsx
import {
  CardMedia as MUICardMedia,
  CardMediaProps as MUICardMediaProps,
} from '@mui/material';

export type CardMediaProps = MUICardMediaProps;

export const CardMedia = (props: CardMediaProps) => (
  <MUICardMedia data-testid="cardMedia" {...props} />
);
