import { Story, Meta } from '@storybook/react';
import { Slider, SliderProps } from './Slider';

export default {
  component: Slider,
  title: 'Slider',
} as Meta;

const Template: Story<SliderProps> = (args) => <Slider {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
