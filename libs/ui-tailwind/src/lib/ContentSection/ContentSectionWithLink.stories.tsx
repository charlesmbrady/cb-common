// src/components/ContentSectionWithLink.stories.tsx
import type { Meta, StoryFn } from '@storybook/react';
import ContentSectionWithLink from './ContentSectionWithLink';

export default {
  component: ContentSectionWithLink,
  title: 'Components/ContentSectionWithLink',
} as Meta<typeof ContentSectionWithLink>;

const Template: StoryFn<typeof ContentSectionWithLink> = (args) => <ContentSectionWithLink {...args} />;

export const Default = Template.bind({});
Default.args = {
  subtitle: 'ROOF PARTY POLAROID',
  title: 'Master Cleanse Reliac Heirloom',
  description:
    "Whatever cardigan tote bag tumblr hexagon brooklyn asymmetrical gentrify, subway tile poke farm-to-table. Franzen you probably haven't heard of them man bun deep jianbing selfies heirloom prism food truck ugh squid celiac humblebrag.",
  cards: [
    {
      title: 'Shooting Stars',
      description: 'Fingerstache flexitarian street art 8-bit waistcoat. Distillery hexagon disrupt edison bulbche.',
      linkText: 'Learn More',
      onLinkClick: () => alert('Learn More clicked for Shooting Stars'),
    },
    {
      title: 'The Catalyzer',
      description: 'Fingerstache flexitarian street art 8-bit waistcoat. Distillery hexagon disrupt edison bulbche.',
      linkText: 'Learn More',
      onLinkClick: () => alert('Learn More clicked for The Catalyzer'),
    },
    {
      title: 'Neptune',
      description: 'Fingerstache flexitarian street art 8-bit waistcoat. Distillery hexagon disrupt edison bulbche.',
      linkText: 'Learn More',
      onLinkClick: () => alert('Learn More clicked for Neptune'),
    },
    {
      title: 'Melanchole',
      description: 'Fingerstache flexitarian street art 8-bit waistcoat. Distillery hexagon disrupt edison bulbche.',
      linkText: 'Learn More',
      onLinkClick: () => alert('Learn More clicked for Melanchole'),
    },
  ],
  buttonText: 'Button',
  onButtonClick: () => alert('Button clicked!'),
};
