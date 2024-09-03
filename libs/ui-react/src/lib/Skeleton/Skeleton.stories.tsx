import { Story, Meta } from '@storybook/react';
import { Skeleton, SkeletonProps } from './Skeleton';

export default {
  component: Skeleton,
  title: 'Skeleton',
} as Meta;

const Template: Story<SkeletonProps> = (args) => <Skeleton {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
