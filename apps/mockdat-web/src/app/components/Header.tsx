import React, { ReactNode } from 'react';
import { Typography, TypographyProps } from '@mui/material';

interface HeaderProps extends TypographyProps {
  children: ReactNode;
}

const Header = ({ children, ...props }: HeaderProps) => (
  <Typography
    variant="h4"
    sx={{ color: 'text.primary' }}
    gutterBottom
    {...props}
  >
    {children}
  </Typography>
);

export default Header;
