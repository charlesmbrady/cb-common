// ui/mui/core/src/ButtonGroup.tsx
import {
  ButtonGroup as MUIButtonGroup,
  ButtonGroupProps as MUIButtonGroupProps,
} from '@mui/material';

export type ButtonGroupProps = MUIButtonGroupProps;

export const ButtonGroup = (props: ButtonGroupProps) => (
  <MUIButtonGroup data-testid="buttonGroup" {...props} />
);
