import React, { ReactNode } from 'react';
import { Typography, TypographyProps } from '@mui/material';

interface SubHeaderProps extends TypographyProps {
  children: ReactNode;
}

const SubHeader = ({ children, ...props }: SubHeaderProps) => (
  <Typography variant="h5" sx={{ color: 'text.primary' }} {...props}>
    {children}
  </Typography>
);

export default SubHeader;
