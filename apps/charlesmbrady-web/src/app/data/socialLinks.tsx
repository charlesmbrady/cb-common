import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { SocialLinkItem } from '@cb-common/ui-react-mui';

export const socialLinks: SocialLinkItem[] = [
  {
    icon: <GitHubIcon />,
    href: 'https://github.com/charlesmbrady',
    ariaLabel: 'GitHub',
  },
  {
    icon: <LinkedInIcon />,
    href: 'https://www.linkedin.com/in/charlesmbrady/',
    ariaLabel: 'LinkedIn',
  },
];
