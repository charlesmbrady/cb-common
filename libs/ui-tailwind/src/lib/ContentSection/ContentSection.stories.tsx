// src/components/ContentSection.stories.tsx
import type { Meta, StoryFn } from '@storybook/react';
import { ContentSection } from './ContentSection';
import { Laptop, Search, ShoppingCart } from '@mui/icons-material';

export default {
  component: ContentSection,
  title: 'Components/ContentSection',
} as Meta<typeof ContentSection>;

const Template: StoryFn<typeof ContentSection> = (args) => <ContentSection {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: 'Our Services',
  description: 'We provide a wide range of web development services tailored to your business needs.',
  features: [
    { title: 'Responsive Design', description: 'We create mobile-friendly designs.', icon: <Laptop /> },
    { title: 'SEO Optimization', description: "Boost your site's ranking on search engines.", icon: <Search /> },
    { title: 'E-commerce Solutions', description: 'Start selling your products online.', icon: <ShoppingCart /> },
  ],
};
