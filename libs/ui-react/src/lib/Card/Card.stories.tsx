import { Story, Meta } from '@storybook/react';
import { Card } from './Card';

export default {
  component: Card,
  title: 'Card',
} as Meta;

const Template: Story = (args) => <Card {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
