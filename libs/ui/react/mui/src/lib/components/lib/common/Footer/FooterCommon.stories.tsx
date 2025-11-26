import type { Meta, StoryObj } from '@storybook/react';
import { FooterCommon } from './FooterCommon';

const meta: Meta<typeof FooterCommon> = {
  title: 'Common/Footer/FooterCommon',
  component: FooterCommon,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    newsletterProps: {
      control: 'object',
    },
    productColumnProps: {
      control: 'object',
    },
    companyColumnProps: {
      control: 'object',
    },
    copyrightProps: {
      control: 'object',
    },
    socialLinksProps: {
      control: 'object',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomNewsletter: Story = {
  args: {
    newsletterProps: {
      title: 'Stay Updated',
      description: 'Get the latest news and updates delivered to your inbox.',
      emailPlaceholder: 'Enter your email address',
      buttonText: 'Subscribe Now',
    },
  },
};

export const CustomCopyright: Story = {
  args: {
    copyrightProps: {
      companyName: 'Your Company Name',
      companyUrl: 'https://yourcompany.com',
      year: 2025,
    },
  },
};
