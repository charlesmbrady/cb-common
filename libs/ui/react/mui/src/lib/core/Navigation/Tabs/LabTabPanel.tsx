// ui/mui/core/src/LabTabPanel.tsx
import { TabPanel as MUITabPanel, TabPanelProps } from '@mui/lab';
export const LabTabPanel = (props: TabPanelProps) => (
  <MUITabPanel data-testid="tabPanel" {...props} />
);
