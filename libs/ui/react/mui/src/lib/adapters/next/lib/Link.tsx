'use client';

import * as React from 'react';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';

export type LinkProps = React.PropsWithChildren<
  NextLinkProps & React.AnchorHTMLAttributes<HTMLAnchorElement>
>;

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ children, ...props }, ref) => (
    <NextLink ref={ref} {...props}>
      {children}
    </NextLink>
  )
);
Link.displayName = 'Link';
