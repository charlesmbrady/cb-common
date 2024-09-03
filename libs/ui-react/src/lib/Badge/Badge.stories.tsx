import { Story, Meta } from '@storybook/react';
import { Badge, BadgeProps } from './Badge';

export default {
  component: Badge,
  title: 'Badge',
} as Meta;

const Template: Story<BadgeProps> = (args) => <Badge {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
