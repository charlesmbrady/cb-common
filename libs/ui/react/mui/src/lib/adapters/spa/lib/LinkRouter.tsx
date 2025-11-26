import * as React from 'react';
import { Link as RRLink, LinkProps as RRLinkProps } from 'react-router-dom';

export type LinkRouterProps = RRLinkProps & { href?: string };
export const LinkRouter = React.forwardRef<HTMLAnchorElement, LinkRouterProps>(
  ({ href, to, ...props }, ref) => (
    <RRLink ref={ref} to={href ?? to ?? '#'} {...props} />
  )
);
LinkRouter.displayName = 'LinkRouter';
