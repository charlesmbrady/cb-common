// ui/mui/core/src/Card.tsx
import { Card as MUICard, CardProps as MuiCardProps } from '@mui/material';

export type CardProps = MuiCardProps & {
  title?: string;
};

export const Card = (props: CardProps) => (
  <MUICard data-testid="card" {...props} />
);
