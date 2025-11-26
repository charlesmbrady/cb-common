// ui/mui/core/src/Collapse.tsx
import {
  Collapse as MUICollapse,
  CollapseProps as MUICollapseProps,
} from '@mui/material';

export type CollapseProps = MUICollapseProps;

export const Collapse = (props: CollapseProps) => (
  <MUICollapse data-testid="collapse" {...props} />
);
