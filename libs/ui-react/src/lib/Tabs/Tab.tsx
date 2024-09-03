import MuiTab, { TabProps as MuiTabProps } from '@mui/material/Tab';

export type TabProps = MuiTabProps;

export function Tab(props: TabProps) {
  return <MuiTab data-test="tab" {...props} />;
}

export default Tab;
