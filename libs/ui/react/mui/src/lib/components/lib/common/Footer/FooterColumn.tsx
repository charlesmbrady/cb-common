import * as React from 'react';
import { Box, Typography, Link } from '../../../../core';

export type FooterLinkItem = {
  label: string;
  href: string;
};

export type FooterColumnProps = {
  title: string;
  links: FooterLinkItem[];
};

export function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <Box
      sx={{
        display: { xs: 'none', sm: 'flex' },
        flexDirection: 'column',
        gap: 1,
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
        {title}
      </Typography>
      {links.map((link, index) => (
        <Link
          key={index}
          color="text.secondary"
          variant="body2"
          href={link.href}
        >
          {link.label}
        </Link>
      ))}
    </Box>
  );
}
