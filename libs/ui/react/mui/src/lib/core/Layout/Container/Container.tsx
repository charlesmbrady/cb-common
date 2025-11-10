// ui/mui/core/src/Container.tsx
import { Container as MUIContainer, ContainerProps } from '@mui/material';
export const Container = (props: ContainerProps) => (
  <MUIContainer data-testid="container" {...props} />
);
