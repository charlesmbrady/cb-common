import { Story, Meta } from '@storybook/react';
import { Switch, SwitchProps } from './Switch';

export default {
  component: Switch,
  title: 'Switch',
} as Meta;

const Template: Story<SwitchProps> = (args) => <Switch {...args} />;

export const Primary = Template.bind({});
export const Alternate = Template.bind({});
Primary.args = {};
Alternate.args = {
  color: 'primary',
};
