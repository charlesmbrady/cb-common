import type { Meta, StoryFn } from '@storybook/react';
import { HeroSection } from './HeroSection';

export default {
  component: HeroSection,
  title: 'Components/HeroSection',
} as Meta<typeof HeroSection>;

// Template for rendering the HeroSection component
const Template: StoryFn<typeof HeroSection> = (args) => <HeroSection {...args} />;

// Default story
export const Default = Template.bind({});
Default.args = {
  title: 'Welcome to My Website',
  description: 'We are glad to have you here.',
  primaryCtaLabel: 'Get Started',
  primaryCtaLink: '#',
  secondaryCtaLabel: 'Learn More',
  secondaryCtaLink: '#',
  imageUrl: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0',
};

// Another example story
export const Alternate = Template.bind({});
Alternate.args = {
  title: 'Explore Our Services',
  description: 'Find out more about what we offer.',
  primaryCtaLabel: 'Get Started',
  primaryCtaLink: '#',
  secondaryCtaLabel: 'Learn More',
  secondaryCtaLink: '#',
  imageUrl: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0',
};
