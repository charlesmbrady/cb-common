import type { AppBarNavigationItem } from '@cb-common/ui-react-mui';

export const navItems: AppBarNavigationItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'About',
    href: '/about', // TODO: add AboutPage describing this apps subdomain purpose
  },
];
