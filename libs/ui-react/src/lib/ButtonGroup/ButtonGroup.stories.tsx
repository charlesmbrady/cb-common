import { Story, Meta } from '@storybook/react';
import { ButtonGroup, ButtonGroupProps } from './ButtonGroup';
import Button from '../Button/Button';

export default {
  component: ButtonGroup,
  title: 'ButtonGroup',
} as Meta;

const Template: Story<ButtonGroupProps> = (args) => (
  <ButtonGroup {...args}>
    <Button>Click Me</Button>
    <Button>Click Me</Button>
    <Button>Click Me</Button>
  </ButtonGroup>
);

export const Primary = Template.bind({});
Primary.args = {};
