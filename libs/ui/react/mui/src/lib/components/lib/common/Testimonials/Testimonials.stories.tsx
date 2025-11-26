import type { Meta, StoryFn } from '@storybook/react';
import Avatar from '@mui/material/Avatar';
import { TestimonialsCommon } from './TestimonialsCommon';
import { TestimonialsHeader } from './TestimonialsHeader';
import { TestimonialCard } from './TestimonialCard';
import { TestimonialsGrid } from './TestimonialsGrid';
import { defaultTestimonials } from './testimonialsData';

const meta: Meta<typeof TestimonialsCommon> = {
  component: TestimonialsCommon,
  title: 'Components/Common/Testimonials',
};
export default meta;

export const TestimonialsCommonBasic: StoryFn = () => {
  return <TestimonialsCommon />;
};

export const TestimonialsCommonWithoutLogos: StoryFn = () => {
  return (
    <TestimonialsCommon
      gridProps={{
        showLogos: false,
      }}
    />
  );
};

export const TestimonialsCommonCustomHeader: StoryFn = () => {
  return (
    <TestimonialsCommon
      headerProps={{
        title: 'What Our Customers Say',
        description:
          'Hear from real users about their experiences with our products and services.',
      }}
    />
  );
};

export const TestimonialsCommonCustomTestimonials: StoryFn = () => {
  const customTestimonials = [
    {
      avatar: <Avatar>JS</Avatar>,
      name: 'Jane Smith',
      occupation: 'Product Manager',
      testimonial:
        'This is a custom testimonial showcasing the flexibility of the component.',
    },
    {
      avatar: <Avatar>JD</Avatar>,
      name: 'John Doe',
      occupation: 'Software Engineer',
      testimonial:
        'Another custom testimonial to demonstrate multiple testimonials.',
    },
  ];

  return (
    <TestimonialsCommon
      headerProps={{
        title: 'Custom Testimonials',
        description: 'These are custom testimonials with different content.',
      }}
      gridProps={{
        testimonials: customTestimonials,
        showLogos: false,
      }}
    />
  );
};

export const TestimonialsHeaderOnly: StoryFn = () => {
  return (
    <TestimonialsHeader
      title="Sample Header"
      description="This is just the header component isolated."
    />
  );
};

export const TestimonialCardSingle: StoryFn = () => {
  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <TestimonialCard
        testimonial={defaultTestimonials[0]}
        logo="https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/6560628889c3bdf1129952dc_Sydney-black.svg"
        logoAlt="Company Logo"
      />
    </div>
  );
};

export const TestimonialsGridOnly: StoryFn = () => {
  return (
    <TestimonialsGrid
      testimonials={defaultTestimonials.slice(0, 3)}
      showLogos={true}
    />
  );
};
