import { Story, Meta } from '@storybook/react';
import { Button } from './Button';
import { withDesign } from 'storybook-addon-designs'

export default {
  component: Button,
  title: 'Button',
  decorators: [withDesign]
} as Meta;

const Template: Story = (args) => <Button {...args}>Click Me</Button>;

export const Primary = Template.bind({});
Primary.args = {};


Primary.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/jhyTLZnP27vea4yX32pkAq/Starter?node-id=2825%3A3058',
  },
}