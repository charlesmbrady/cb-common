// ui/mui/core/src/Typography.tsx
import { Typography as MUITypography, TypographyProps } from '@mui/material';
export const Typography = (props: TypographyProps) => (
  <MUITypography data-testid="typography" {...props} />
);
