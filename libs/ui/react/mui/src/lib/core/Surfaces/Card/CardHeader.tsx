// ui/mui/core/src/CardHeader.tsx
import {
  CardHeader as MUICardHeader,
  CardHeaderProps as MUICardHeaderProps,
} from '@mui/material';

export type CardHeaderProps = MUICardHeaderProps;

export const CardHeader = (props: CardHeaderProps) => (
  <MUICardHeader data-testid="cardHeader" {...props} />
);
