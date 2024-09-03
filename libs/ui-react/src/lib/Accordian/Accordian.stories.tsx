import { Story, Meta } from '@storybook/react';
import { Accordian, AccordianProps } from './Accordian';

export default {
  component: Accordian,
  title: 'Accordian',
} as Meta;

const Template: Story<AccordianProps> = (args) => <Accordian {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
