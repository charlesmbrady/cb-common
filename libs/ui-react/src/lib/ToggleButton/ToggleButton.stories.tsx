import { Story, Meta } from '@storybook/react';
import { ToggleButton } from './ToggleButton';

export default {
  component: ToggleButton,
  title: 'ToggleButton',
} as Meta;

const Template: Story = (args) => <ToggleButton {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
