import React from 'react';
import { Box, Typography } from '@mui/material';

export interface Technology {
  name: string;
  logo: string;
}

export const TechnologyCard: React.FC<{ technology: Technology }> = ({
  technology,
}) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      p: 2,
      borderRadius: 2,
      border: '1px solid transparent',
      opacity: 0.85,
      transition:
        'opacity 0.25s ease, transform 0.25s ease, border-color 0.25s ease, background-color 0.25s ease',
      '&:hover': {
        opacity: 1,
        transform: 'translateY(-3px)',
        borderColor: 'divider',
        backgroundColor: 'action.hover',
      },
    }}
  >
    <Box
      component="img"
      src={technology.logo}
      alt={technology.name}
      sx={{
        width: 44,
        height: 44,
        objectFit: 'contain',
        mb: 1,
      }}
    />
    <Typography
      variant="caption"
      align="center"
      sx={{ color: 'text.secondary', fontWeight: 500 }}
    >
      {technology.name}
    </Typography>
  </Box>
);
