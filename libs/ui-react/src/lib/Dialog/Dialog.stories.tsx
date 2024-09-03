import { Story, Meta } from '@storybook/react';
import { Dialog, DialogProps } from './Dialog';

export default {
  component: Dialog,
  title: 'Dialog',
} as Meta;

const Template: Story<DialogProps> = (args) => <Dialog {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
