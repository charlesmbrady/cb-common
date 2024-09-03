import { Story, Meta } from '@storybook/react';
import Box from '../Box/Box';
import { DataSection, DataSectionProps } from './DataSection';

export default {
  component: DataSection,
  title: 'DataSection',
} as Meta;

const Template: Story<DataSectionProps> = (args) => (
  <Box width={500}>
    <DataSection {...args} />
  </Box>
);

export const Primary = Template.bind({});
Primary.args = {
  title: 'Section Title',
  items: [
    { label: 'item 0', value: 'value 0' },
    { label: 'item 1', value: 'value 1' },
    { label: 'item 2', value: 'value 2' },
    { label: 'item 3', value: 'value 3' },
    { label: 'item 4', value: 'value 4' },
  ],
};
