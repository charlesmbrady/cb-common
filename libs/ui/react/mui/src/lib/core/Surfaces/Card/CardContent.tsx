// ui/mui/core/src/CardContent.tsx
import {
  CardContent as MUICardContent,
  CardContentProps as MUICardContentProps,
} from '@mui/material';

export type CardContentProps = MUICardContentProps;

export const CardContent = (props: CardContentProps) => (
  <MUICardContent data-testid="cardContent" {...props} />
);
