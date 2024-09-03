import { Story, Meta } from '@storybook/react';
import { Chip, ChipProps } from './Chip';

export default {
  component: Chip,
  title: 'Chip',
} as Meta;

const Template: Story<ChipProps> = (args) => <Chip {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
