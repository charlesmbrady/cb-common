import React from 'react';
import { Box, Typography } from '@mui/material';

export default function LogoutPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Typography
        variant="h3"
        sx={{
          color: 'white',
          fontWeight: 700,
          mb: 2,
          textShadow: '0 2px 16px rgba(0,0,0,0.2)',
        }}
      >
        You have been signed out
      </Typography>
      <Typography
        variant="h5"
        sx={{
          color: 'white',
          opacity: 0.9,
          mb: 1,
          textShadow: '0 1px 8px rgba(0,0,0,0.15)',
        }}
      >
        Thanks for checking out Mockdat!
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: 'white',
          opacity: 0.8,
          mt: 2,
          textAlign: 'center',
          maxWidth: 400,
        }}
      >
        See you later 👋
      </Typography>
    </Box>
  );
}
