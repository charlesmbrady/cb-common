// ui/mui/core/src/Tabs.tsx
import { Tabs as MUITabs, TabsProps } from '@mui/material';
export const Tabs = (props: TabsProps) => (
  <MUITabs data-testid="tabs" {...props} />
);
