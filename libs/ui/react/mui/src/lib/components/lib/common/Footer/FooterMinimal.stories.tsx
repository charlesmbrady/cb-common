import type { Meta, StoryObj } from '@storybook/react';
import { FooterMinimal } from './FooterMinimal';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import { Box } from '../../../../core';

const meta: Meta<typeof FooterMinimal> = {
  title: 'Common/Footer/FooterMinimal',
  component: FooterMinimal,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    brand: { control: false },
    middle: { control: false },
    socialLinksProps: { control: 'object' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomContent: Story = {
  args: {
    brand: (
      <Box sx={{ fontWeight: 700, letterSpacing: 1, fontSize: '1rem' }}>
        My Brand
      </Box>
    ),
    middle: (
      <Box sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
        © {new Date().getFullYear()} My Company
      </Box>
    ),
    socialLinksProps: {
      links: [
        {
          icon: <GitHubIcon />,
          href: 'https://github.com',
          ariaLabel: 'GitHub',
        },
        {
          icon: <LinkedInIcon />,
          href: 'https://linkedin.com',
          ariaLabel: 'LinkedIn',
        },
        {
          icon: <EmailIcon />,
          href: 'mailto:hello@example.com',
          ariaLabel: 'Email',
        },
      ],
    },
  },
};
