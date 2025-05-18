import React, { ReactNode } from 'react';
import { Button, ButtonProps } from '@mui/material';

interface MockdatButtonProps extends ButtonProps {
  children: ReactNode;
}

const MockdatButton = ({
  children,
  variant = 'contained',
  sx = {},
  ...props
}: MockdatButtonProps) => (
  <Button
    variant={variant}
    sx={{ borderRadius: 8, fontWeight: 500, px: 3, ...sx }}
    {...props}
  >
    {children}
  </Button>
);

export default MockdatButton;
