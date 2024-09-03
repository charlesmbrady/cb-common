import { Story, Meta } from '@storybook/react';
import Typography from '../Typography/Typography';
import { FullScreenLoader, FullScreenLoaderProps } from './FullScreenLoader';

export default {
  component: FullScreenLoader,
  title: 'FullScreenLoader',
} as Meta;

const Template: Story = (args: Partial<FullScreenLoaderProps>) => (
  <>
    <Typography variant="h1">Background content</Typography>
    <FullScreenLoader open {...args} />
  </>
);

export const Primary = Template.bind({});
Primary.args = {
  open: true,
};
