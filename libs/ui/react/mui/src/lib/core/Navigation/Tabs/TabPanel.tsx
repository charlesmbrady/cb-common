// ui/mui/core/src/TabPanel.tsx
import { Box } from '../../Layout/Box/Box';

export type TabPanelProps = {
  children?: React.ReactNode;
  index: number;
  value: number;
};

export function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export const TabPanel = (props: TabPanelProps) => {
  const { children, index, value, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};
