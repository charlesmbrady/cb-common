import * as React from 'react';
import { Link as MUILink, LinkProps as MUILinkProps } from '@mui/material';
import {
  Link as ReactRouterLink,
  LinkProps as ReactRouterLinkProps,
} from 'react-router-dom';

// Combines MUI Link styling with react-router-dom navigation.
export type RouterLinkProps = Omit<MUILinkProps, 'href' | 'component'> &
  ReactRouterLinkProps;

export const RouterLink = React.forwardRef<HTMLAnchorElement, RouterLinkProps>(
  (
    { to, reloadDocument, replace, state, preventScrollReset, ...rest },
    ref
  ) => (
    <MUILink
      component={ReactRouterLink}
      to={to}
      reloadDocument={reloadDocument}
      replace={replace}
      state={state}
      preventScrollReset={preventScrollReset}
      ref={ref}
      {...rest}
    />
  )
);

RouterLink.displayName = 'RouterLink';
