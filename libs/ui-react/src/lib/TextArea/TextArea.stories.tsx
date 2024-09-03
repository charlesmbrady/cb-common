import { Story, Meta } from '@storybook/react';
import { TextAreaAutosize } from './TextArea';

export default {
  component: TextAreaAutosize,
  title: 'TextAreaAutosize',
} as Meta;

const Template: Story = (args) => <TextAreaAutosize {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
