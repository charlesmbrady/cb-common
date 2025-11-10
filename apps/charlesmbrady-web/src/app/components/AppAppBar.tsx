import { RouterLink } from '@cb-common/ui-react-mui';
import {
  AppAppBarCommon,
  AppBarNavigationItem,
  Box,
} from '@cb-common/ui-react-mui';
const navItems: AppBarNavigationItem[] = [
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Technologies', href: '/technologies' },
  { label: 'Work', href: '/work' },
  { label: 'Contact', href: '/contact' },
];

export const AppAppBar: React.FC = () => (
  <AppAppBarCommon
    brandProps={{
      logo: (
        <RouterLink
          to="/"
          underline="none"
          color="inherit"
          style={{ textDecoration: 'none' }}
        >
          <Box
            sx={{
              fontWeight: 700,
              letterSpacing: 1,
              fontSize: '1.1rem',
              textDecoration: 'none',
            }}
          >
            Charles Brady
          </Box>
        </RouterLink>
      ),
      navigationProps: {
        items: navItems.map(({ label, href }) => ({ label, href })),
      },
    }}
    actionsProps={{
      signInText: 'GitHub',
      signUpText: 'Resume',
      onSignInClick: () =>
        window.open('https://github.com/charlesmbrady', '_blank'),
      onSignUpClick: () => window.open('/resume.pdf', '_blank'),
      showColorMode: true,
    }}
    mobileMenuProps={{
      navigationItems: navItems.map(({ label, href }) => ({ label, href })),
      signInText: 'GitHub',
      signUpText: 'Resume',
      onSignInClick: () =>
        window.open('https://github.com/charlesmbrady', '_blank'),
      onSignUpClick: () => window.open('/resume.pdf', '_blank'),
      showColorMode: true,
    }}
  />
);
