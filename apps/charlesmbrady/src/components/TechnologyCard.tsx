import React from 'react';
import { Card, CardContent, Typography, Box, Link } from '@mui/material';
import { Technology } from './types';

interface TechnologyCardProps {
  technology: Technology;
}

export const TechnologyCard: React.FC<TechnologyCardProps> = ({ technology }) => {
  return (
    <Link 
      href={technology.url} 
      target="_blank" 
      rel="noopener noreferrer"
      sx={{ 
        textDecoration: 'none',
        '&:hover': {
          transform: 'translateY(-4px)',
          transition: 'transform 0.2s ease-in-out',
        },
      }}
    >
      <Card 
        sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 2,
          backgroundColor: 'background.paper',
          '&:hover': {
            boxShadow: 6,
          },
        }}
      >
        <Box
          component="img"
          src={technology.logo}
          alt={technology.name}
          sx={{
            height: 60,
            width: 'auto',
            objectFit: 'contain',
            mb: 1,
          }}
        />
        <CardContent sx={{ p: 1, textAlign: 'center' }}>
          <Typography variant="subtitle1" component="div">
            {technology.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {technology.category}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
}; 