import * as React from 'react';
import { Box, Container, Typography } from '../../../../core';
import { FooterSocialLinks, FooterSocialLinksProps } from './FooterSocialLinks';
import SitemarkIcon from '../SitemarkIcon';
import { defaultSocialLinks } from './footerData';

export type FooterMinimalProps = {
  brand?: React.ReactNode;
  middle?: React.ReactNode;
  socialLinksProps?: FooterSocialLinksProps;
  sx?: any;
};

/**
 * A minimal footer with three regions: left (brand), middle (custom content), right (social links).
 * - Stacks vertically on xs and switches to a horizontal row on sm+.
 */
export function FooterMinimal({
  brand = (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
      <SitemarkIcon />
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        Brand
      </Typography>
    </Box>
  ),
  middle = (
    <Typography variant="caption" color="text.secondary">
      © {new Date().getFullYear()}
    </Typography>
  ),
  socialLinksProps = { links: defaultSocialLinks },
  sx,
}: FooterMinimalProps) {
  return (
    <Container
      sx={{
        py: 2,
        borderTop: '1px solid',
        borderColor: 'divider',
        ...sx,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            width: { xs: '100%', sm: 'auto' },
            textAlign: { xs: 'center', sm: 'left' },
          }}
        >
          {brand}
        </Box>
        <Box sx={{ flex: 1, textAlign: 'center' }}>{middle}</Box>
        <Box
          sx={{
            width: { xs: '100%', sm: 'auto' },
            textAlign: { xs: 'center', sm: 'right' },
          }}
        >
          <FooterSocialLinks {...socialLinksProps} />
        </Box>
      </Box>
    </Container>
  );
}
