import { useState } from 'react';
import MuiAppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import Settings from '@mui/icons-material/Settings';
import EmailIcon from '@mui/icons-material/Email';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';

import Toolbar from '../Toolbar/Toolbar';
import Button from '../Button/Button';
import Box from '../Box/Box';
import { MenuItem, MenuItemProps } from '../MenuItem/MenuItem';
import Container from '../Container/Container';
import Typography from '../Typography/Typography';
import { useAppConfig, useUser } from '../contexts';

export type AppBarProps = React.ComponentProps<typeof MuiAppBar> & {
  navItems?: NavItem[];
};

export type NavItem = {
  label: string;
  path: string;
};

type MenuNavItemProps = {
  navItem: NavItem;
  onClick: () => void;
};

type MenuLinkItemProps = {
  label: string;
  path: string;
  icon: React.ReactNode;
};

function NonClickableMenuItem(props: MenuItemProps) {
  return <MenuItem {...props} disabled sx={{ '&.Mui-disabled': { opacity: 1 } }} />;
}

function MenuLinkItem(props: MenuLinkItemProps) {
  return (
    <MenuItem>
      <Link
        href={props.path}
        sx={{
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          color: 'inherit',
        }}
        component="a"
      >
        {props.icon}
        <Typography variant="body2">{props.label}</Typography>
      </Link>
    </MenuItem>
  );
}

function MenuNavItem({ navItem, onClick }: MenuNavItemProps) {
  return (
    <MenuItem onClick={onClick}>
      <Link href={navItem.path} sx={{ textDecoration: 'none', textTransform: 'uppercase' }} component="a">
        {navItem.label}
      </Link>
    </MenuItem>
  );
}

function NavButton({ label, path }: NavItem) {
  return (
    // use theme and location to set selected nav button underline to "sun" color
    // also set height to 64 px which is the same as the appbar height and makes sure the nav buttons match to fit appbar height
    <Button
      href={path}
      sx={{
        height: 64,
        borderBottom: path === '/' ? `2px solid` : 'none',
        borderBottomColor: 'sun.main',
      }}
    >
      {label}
    </Button>
  );
}

export function BuiltAppBar({ navItems, ...props }: AppBarProps) {
  const appConfig = useAppConfig();
  const [user, { signOut }] = useUser();

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <MuiAppBar position="static" {...props} sx={{ width: '100%' }}>
      <Container sx={{ flex: 1 }} maxWidth="xl">
        {/* Remove default toolbar padding from media queries by setting to xs: 0 and minHeight to whatever we want the appbar height to be */}
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: { xs: 0 },
          }}
        >
          <Box display="flex" alignContent="center">
            <Link href={appConfig.data?.websiteUrl || 'https://curi.com'} component="a">
              <img height="50px" src="/assets/images/CURI_horizontal_reverse_light.svg" alt="Curi logo" />
            </Link>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, justifyContent: 'flex-end' }}>
            <IconButton
              size="large"
              aria-label="nav-menu"
              aria-controls="nav-menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </Box>
          <Menu
            id="nav-menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
              display: { xs: 'block', md: 'none' },
            }}
          >
            {navItems?.map(({ label, path }: NavItem) => (
              <MenuNavItem key={path} navItem={{ label, path }} onClick={handleCloseNavMenu} />
            ))}
          </Menu>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, height: 1, justifyContent: 'flex-end' }}>
            {navItems?.map(({ label, path }: NavItem) => (
              <NavButton key={path} label={label} path={path} />
            ))}
          </Box>
          {user.data && (
            <>
              <Box sx={{ flexGrow: 0 }}>
                <IconButton
                  aria-label="user-menu"
                  aria-controls="user-menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenUserMenu}
                  sx={{ pl: 1 }}
                >
                  <Avatar
                    alt="user avatar"
                    sx={{
                      backgroundColor: 'primary.main',
                      color: 'sun.main',
                      border: `1px solid`,
                      borderColor: 'sun.main',
                      fontSize: '1rem',
                    }}
                  >
                    {/* Create 'initials avatar' using first letter(s) of names */}
                    {user.data.firstName[0] + user.data.lastName[0]}
                  </Avatar>
                  <ArrowDropDownIcon sx={{ color: 'sun.main' }} />
                </IconButton>
              </Box>
              <Menu
                id="user-menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <NonClickableMenuItem>
                  <Typography variant="body1">{user.data.firstName + ' ' + user.data.lastName}</Typography>
                </NonClickableMenuItem>
                <NonClickableMenuItem>
                  <Typography variant="body2">{user.data.email}</Typography>
                </NonClickableMenuItem>
                <Divider />
                <MenuLinkItem
                  label="Change Password"
                  path={`${appConfig.data?.memberProfileUrl}change-password`}
                  icon={<Settings sx={{ color: 'gray' }} fontSize="small" />}
                />
                <MenuLinkItem
                  label="Change Email"
                  path={`${appConfig.data?.memberProfileUrl}change-email`}
                  icon={<EmailIcon sx={{ color: 'gray' }} fontSize="small" />}
                />

                <Divider />
                <MenuItem onClick={signOut}>
                  <Typography variant="body2" sx={{ textTransform: 'uppercase' }}>
                    Sign Out
                  </Typography>
                </MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </Container>
    </MuiAppBar>
  );
}

export default BuiltAppBar;
