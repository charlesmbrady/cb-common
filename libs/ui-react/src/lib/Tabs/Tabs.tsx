import * as React from 'react';
import Tab from './/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from './TabList';
import TabPanel from './TabPanel';
import Box from '../Box/Box';

export type TabsProps = {
  tabComponents: {
    label: string;
    component: React.ReactNode;
  }[];
};

export function Tabs({ tabComponents }: TabsProps) {
  const [value, setValue] = React.useState('0');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  return (
    <TabContext value={value}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <TabList onChange={handleChange} aria-label="tabs">
          {tabComponents.map((tabComponent, i) => (
            <Tab label={tabComponent.label} value={String(i)} />
          ))}
        </TabList>
      </Box>
      {tabComponents.map((tabComponent, i) => (
        <TabPanel value={String(i)}>{tabComponent.component}</TabPanel>
      ))}
    </TabContext>
  );
}

export default Tabs;
