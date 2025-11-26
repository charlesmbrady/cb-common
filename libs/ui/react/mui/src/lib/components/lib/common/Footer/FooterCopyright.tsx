import * as React from 'react';
import { Typography, Link } from '../../../../core';

export type FooterCopyrightProps = {
  companyName?: string;
  companyUrl?: string;
  year?: number;
};

export function FooterCopyright({
  companyName = 'Sitemark',
  companyUrl = 'https://mui.com/',
  year = new Date().getFullYear(),
}: FooterCopyrightProps) {
  return (
    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
      {'Copyright © '}
      <Link color="text.secondary" href={companyUrl}>
        {companyName}
      </Link>
      &nbsp;
      {year}
    </Typography>
  );
}
