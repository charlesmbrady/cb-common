// Tabs.stories.tsx
import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import { Tabs } from './Tabs';
import { Tab } from './Tab';
import { TabPanel, a11yProps } from './TabPanel';
import { Box } from '../../Layout/Box/Box';

const meta: Meta<typeof Tabs> = {
  title: 'Navigation/Tabs',
  component: Tabs,
};
export default meta;

export const TabsVariants: StoryFn = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Item One" {...a11yProps(0)} />
          <Tab label="Item Two" {...a11yProps(1)} />
          <Tab label="Item Three" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        Item One
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
    </Box>
  );
};
