import * as React from 'react';
import { Stack } from '../../../../core';
import IconButton from '@mui/material/IconButton';

export type SocialLinkItem = {
  icon: React.ReactNode;
  href: string;
  ariaLabel: string;
};

export type FooterSocialLinksProps = {
  links: SocialLinkItem[];
};

export function FooterSocialLinks({ links }: FooterSocialLinksProps) {
  return (
    <Stack
      direction="row"
      spacing={1}
      useFlexGap
      sx={{ justifyContent: 'center', color: 'text.secondary' }}
    >
      {links.map((link, index) => (
        <IconButton
          key={index}
          color="inherit"
          size="small"
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.ariaLabel}
          sx={{ alignSelf: 'center' }}
        >
          {link.icon}
        </IconButton>
      ))}
    </Stack>
  );
}
