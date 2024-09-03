// src/components/ContactSection.stories.tsx
import type { Meta, StoryFn } from '@storybook/react';
import { ContactSection } from './ContactSection';

export default {
  component: ContactSection,
  title: 'Components/ContactSection',
} as Meta<typeof ContactSection>;

const Template: StoryFn<typeof ContactSection> = (args) => <ContactSection {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: 'Contact Us',
  description: 'Whatever cardigan tote bag tumblr hexagon brooklyn asymmetrical gentrify.',
  onFormSubmit: (formData) => alert(`Form submitted: ${JSON.stringify(formData)}`),
  buttonText: 'Submit',
  email: 'example@email.com',
  address: '49 Smith St.\nSaint Cloud, MN 56301',
  facebookUrl: 'https://facebook.com',
  twitterUrl: 'https://twitter.com',
  instagramUrl: 'https://instagram.com',
  linkedinUrl: 'https://linkedin.com',
  githubUrl: 'https://github.com',
};
