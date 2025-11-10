// ui/mui/core/src/TabScrollButton.tsx
import {
  TabScrollButton as MUITabScrollButton,
  TabScrollButtonProps,
} from '@mui/material';
export const TabScrollButton = (props: TabScrollButtonProps) => (
  <MUITabScrollButton data-testid="tabScrollButton" {...props} />
);
