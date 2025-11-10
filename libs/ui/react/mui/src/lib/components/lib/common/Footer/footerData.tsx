import * as React from 'react';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/X';
import { FooterLinkItem } from './FooterColumn';
import { SocialLinkItem } from './FooterSocialLinks';
import { FooterLegalLinkItem } from './FooterLegalLinks';

export const defaultProductLinks: FooterLinkItem[] = [
  { label: 'Features', href: '#' },
  { label: 'Testimonials', href: '#' },
  { label: 'Highlights', href: '#' },
  { label: 'Pricing', href: '#' },
  { label: 'FAQs', href: '#' },
];

export const defaultCompanyLinks: FooterLinkItem[] = [
  { label: 'About us', href: '#' },
  { label: 'Careers', href: '#' },
  { label: 'Press', href: '#' },
];

export const defaultLegalLinks: FooterLinkItem[] = [
  { label: 'Terms', href: '#' },
  { label: 'Privacy', href: '#' },
  { label: 'Contact', href: '#' },
];

export const defaultSocialLinks: SocialLinkItem[] = [
  {
    icon: <GitHubIcon />,
    href: 'https://github.com/mui',
    ariaLabel: 'GitHub',
  },
  {
    icon: <TwitterIcon />,
    href: 'https://x.com/MaterialUI',
    ariaLabel: 'X',
  },
  {
    icon: <LinkedInIcon />,
    href: 'https://www.linkedin.com/company/mui/',
    ariaLabel: 'LinkedIn',
  },
];

export const defaultFooterLegalLinks: FooterLegalLinkItem[] = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
];
