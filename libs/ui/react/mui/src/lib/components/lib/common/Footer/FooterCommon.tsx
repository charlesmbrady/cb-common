import * as React from 'react';
import { Container, Box } from '../../../../core';
import { FooterNewsletter, FooterNewsletterProps } from './FooterNewsletter';
import { FooterColumn, FooterColumnProps } from './FooterColumn';
import { FooterSocialLinks, FooterSocialLinksProps } from './FooterSocialLinks';
import { FooterCopyright, FooterCopyrightProps } from './FooterCopyright';
import { FooterLegalLinks, FooterLegalLinksProps } from './FooterLegalLinks';
import SitemarkIcon from '../SitemarkIcon';
import {
  defaultProductLinks,
  defaultCompanyLinks,
  defaultLegalLinks,
  defaultSocialLinks,
  defaultFooterLegalLinks,
} from './footerData';

export type FooterCommonProps = {
  logo?: React.ReactNode;
  newsletterProps?: FooterNewsletterProps;
  productColumnProps?: FooterColumnProps;
  companyColumnProps?: FooterColumnProps;
  legalColumnProps?: FooterColumnProps;
  socialLinksProps?: FooterSocialLinksProps;
  copyrightProps?: FooterCopyrightProps;
  legalLinksProps?: FooterLegalLinksProps;
};

export function FooterCommon({
  logo = <SitemarkIcon />,
  newsletterProps,
  productColumnProps = {
    title: 'Product',
    links: defaultProductLinks,
  },
  companyColumnProps = {
    title: 'Company',
    links: defaultCompanyLinks,
  },
  legalColumnProps = {
    title: 'Legal',
    links: defaultLegalLinks,
  },
  socialLinksProps = {
    links: defaultSocialLinks,
  },
  copyrightProps,
  legalLinksProps = {
    links: defaultFooterLegalLinks,
  },
}: FooterCommonProps) {
  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 4, sm: 8 },
        py: { xs: 8, sm: 10 },
        textAlign: { sm: 'center', md: 'left' },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            minWidth: { xs: '100%', sm: '60%' },
          }}
        >
          {logo}
          <FooterNewsletter {...newsletterProps} />
        </Box>
        <FooterColumn {...productColumnProps} />
        <FooterColumn {...companyColumnProps} />
        <FooterColumn {...legalColumnProps} />
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          pt: { xs: 4, sm: 8 },
          width: '100%',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <div>
          <FooterLegalLinks {...legalLinksProps} />
          <FooterCopyright {...copyrightProps} />
        </div>
        <FooterSocialLinks {...socialLinksProps} />
      </Box>
    </Container>
  );
}
