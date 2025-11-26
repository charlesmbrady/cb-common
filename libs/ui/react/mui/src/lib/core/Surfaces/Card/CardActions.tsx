// ui/mui/core/src/CardActions.tsx
import {
  CardActions as MUICardActions,
  CardActionsProps as MUICardActionsProps,
} from '@mui/material';

export type CardActionsProps = MUICardActionsProps;

export const CardActions = (props: CardActionsProps) => (
  <MUICardActions data-testid="cardActions" {...props} />
);
