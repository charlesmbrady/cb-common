import { Story, Meta } from '@storybook/react';
import { ImageList, ImageListProps } from './ImageList';

export default {
  component: ImageList,
  title: 'ImageList',
} as Meta;

const Template: Story<ImageListProps> = (args) => <ImageList {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
