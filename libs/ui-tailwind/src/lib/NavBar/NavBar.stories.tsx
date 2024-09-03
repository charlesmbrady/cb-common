import type { Meta, StoryObj, StoryFn } from '@storybook/react';
import { NavBar } from './NavBar';
import ContainerFullscreen from '../ContainerFullscreen/ContainerFullscreen';

export default {
  component: NavBar,
  title: 'NavBar',
} as Meta<typeof NavBar>;

// type Story = StoryFn<typeof NavBar>;

// Template for rendering the Navbar with ContainerFullscreen
const Template: StoryFn<typeof NavBar> = (args) => (
  <ContainerFullscreen>
    <NavBar {...args} />
  </ContainerFullscreen>
);

// Create a basic story
export const Default = Template.bind({});
Default.args = {
  brandName: 'Charlava',
  links: [
    { label: 'Features', href: '#features' },
    { label: 'Contact', href: '#contact' },
    { label: 'About', href: '#about' },
  ],
  ctaLabel: 'Get Started',
  ctaLink: '#pr',
};
