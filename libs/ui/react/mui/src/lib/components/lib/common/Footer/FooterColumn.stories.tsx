import type { Meta, StoryObj } from '@storybook/react';
import { FooterColumn } from './FooterColumn';
import { defaultProductLinks, defaultCompanyLinks } from './footerData';

const meta: Meta<typeof FooterColumn> = {
  title: 'Common/Footer/FooterColumn',
  component: FooterColumn,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
    },
    links: {
      control: 'object',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ProductColumn: Story = {
  args: {
    title: 'Product',
    links: defaultProductLinks,
  },
};

export const CompanyColumn: Story = {
  args: {
    title: 'Company',
    links: defaultCompanyLinks,
  },
};

export const CustomColumn: Story = {
  args: {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '#' },
      { label: 'API Reference', href: '#' },
      { label: 'Tutorials', href: '#' },
      { label: 'Community', href: '#' },
    ],
  },
};
