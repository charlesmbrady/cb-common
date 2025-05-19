import React, { ReactNode } from 'react';
import { Typography, TypographyProps } from '@mui/material';

interface InstructionsTextProps extends TypographyProps {
  children: ReactNode;
}

const InstructionsText = ({ children, ...props }: InstructionsTextProps) => (
  <Typography
    variant="body2"
    sx={{ color: 'text.secondary', fontSize: '1.08rem', mb: 2, ...props.sx }}
    {...props}
  >
    {children}
  </Typography>
);

export default InstructionsText;
