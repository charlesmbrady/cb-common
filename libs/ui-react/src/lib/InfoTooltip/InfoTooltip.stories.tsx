import { Story, Meta } from '@storybook/react';
import Box from '../Box/Box';
import { InfoTooltip, InfoTooltipProps } from './InfoTooltip';

export default {
  component: InfoTooltip,
  title: 'InfoTooltip',
  argTypes: {
    placement: {
      options: [
        'bottom-end',
        'bottom-start',
        'bottom',
        'left',
        'right',
        'top-end',
        'top-start',
        'top',
      ],
      control: { type: 'radio' },
    },
  },
} as Meta;

const Template: Story = (args: Partial<InfoTooltipProps>) => (
  <Box px={24} py={4}>
    <InfoTooltip title="" {...args} />
  </Box>
);

export const Primary = Template.bind({});
Primary.args = {
  title: 'Here is some helpful text',
  placement: 'top',
};
