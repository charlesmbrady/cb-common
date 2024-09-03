import { Story, Meta } from '@storybook/react';
import { Alert, AlertProps } from './Alert';

export default {
  component: Alert,
  title: 'Alert',
} as Meta;

const Template: Story<AlertProps> = (args) => <Alert {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
