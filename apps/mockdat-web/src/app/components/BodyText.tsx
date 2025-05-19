import React, { ReactNode } from 'react';
import { Typography, TypographyProps } from '@mui/material';

interface BodyTextProps extends TypographyProps {
  children: ReactNode;
}

const BodyText = ({ children, ...props }: BodyTextProps) => (
  <Typography variant="body1" sx={{ color: 'text.primary' }} {...props}>
    {children}
  </Typography>
);

export default BodyText;
