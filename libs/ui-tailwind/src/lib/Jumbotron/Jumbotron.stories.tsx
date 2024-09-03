import type { Meta, StoryFn } from '@storybook/react';
import Jumbotron from './Jumbotron';

export default {
  component: Jumbotron,
  title: 'Components/Jumbotron',
} as Meta<typeof Jumbotron>;

// Template for rendering the Jumbotron component
const Template: StoryFn<typeof Jumbotron> = (args) => <Jumbotron {...args} />;

// Default story
export const Default = Template.bind({});
Default.args = {
  primaryText: 'Welcome to My Website',
  secondaryText: 'We are glad to have you here.',
};

// Another example story
export const Alternate = Template.bind({});
Alternate.args = {
  primaryText: 'Explore Our Services',
  secondaryText: 'Find out more about what we offer.',
};
