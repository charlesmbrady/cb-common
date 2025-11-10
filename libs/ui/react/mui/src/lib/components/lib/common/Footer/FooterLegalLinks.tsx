import * as React from 'react';
import { Typography, Link } from '../../../../core';

export type FooterLegalLinkItem = {
  label: string;
  href: string;
};

export type FooterLegalLinksProps = {
  links: FooterLegalLinkItem[];
  separator?: string;
};

const defaultLinks: FooterLegalLinkItem[] = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
];

export function FooterLegalLinks({
  links = defaultLinks,
  separator = '•',
}: FooterLegalLinksProps) {
  return (
    <div>
      {links.map((link, index) => (
        <React.Fragment key={index}>
          <Link color="text.secondary" variant="body2" href={link.href}>
            {link.label}
          </Link>
          {index < links.length - 1 && (
            <Typography sx={{ display: 'inline', mx: 0.5, opacity: 0.5 }}>
              &nbsp;{separator}&nbsp;
            </Typography>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
