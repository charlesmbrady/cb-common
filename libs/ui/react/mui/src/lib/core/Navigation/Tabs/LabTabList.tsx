// ui/mui/core/src/LabTabList.tsx
import { TabList as MUITabList, TabListProps } from '@mui/lab';
export const LabTabList = (props: TabListProps) => (
  <MUITabList data-testid="tabList" {...props} />
);
