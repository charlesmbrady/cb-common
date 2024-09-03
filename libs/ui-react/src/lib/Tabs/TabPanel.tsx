import MuiTabPanel, { TabPanelProps as MuiTabPanelProps } from '@mui/lab/TabPanel';

export type TabPanelProps = MuiTabPanelProps;

export function TabPanel(props: TabPanelProps) {
  return <MuiTabPanel data-test="tabPanel" {...props} />;
}

export default TabPanel;
