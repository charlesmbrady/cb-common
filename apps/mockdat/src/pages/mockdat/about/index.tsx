// pages/mockdat/about/index.tsx
import React from 'react';
import { NextPage } from 'next';
import { Box, Typography, Link } from '@mui/material';

const About: NextPage = () => {
  return (
    <Box sx={{ p: 3 }} data-cy="aboutPage">
      <Typography variant="body1" sx={{ mb: 2 }}>
        Mockdat is an application designed to help you generate large sets of
        realistic mock data for testing, demos, and development.
      </Typography>

      <Typography variant="body1" sx={{ mb: 2 }}>
        Version: <strong data-cy="appVersion">1.0.0</strong>
      </Typography>

      <Typography variant="body1" sx={{ mb: 2 }}>
        Created by the Mockdat team. Learn more at:
        <Link href="https://example.com" sx={{ ml: 0.5 }} data-cy="aboutLink">
          https://example.com
        </Link>
      </Typography>
    </Box>
  );
};

export default About;
