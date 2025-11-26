// ui/mui/core/src/Stack.tsx
import { Stack as MUIStack, StackProps } from '@mui/material';
export const Stack = (props: StackProps) => (
  <MUIStack data-testid="stack" {...props} />
);
