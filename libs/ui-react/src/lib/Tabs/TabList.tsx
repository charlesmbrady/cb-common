import MuiTabList, { TabListProps as MuiTabListProps } from '@mui/lab/TabList';

export type TabListProps = MuiTabListProps;

export function TabList(props: TabListProps) {
  return <MuiTabList data-test="tabList" {...props} />;
}

export default TabList;
