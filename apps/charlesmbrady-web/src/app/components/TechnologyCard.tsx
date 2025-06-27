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
    }}
  >
    <Box
      component="img"
      src={technology.logo}
      alt={technology.name}
      sx={{
        width: 40,
        height: 40,
        objectFit: 'contain',
        mb: 1,
      }}
    />
    <Typography variant="caption" align="center">
      {technology.name}
    </Typography>
  </Box>
);
