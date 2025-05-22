import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { technologies } from '../data/technologies';
import { TechnologyCard } from '../components/TechnologyCard';

const TechnologiesPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom sx={{ textAlign: 'center', mb: 6 }}>
        Technologies
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr 1fr',
            sm: '1fr 1fr 1fr',
            md: '1fr 1fr 1fr 1fr',
          },
          gap: 3,
        }}
      >
        {technologies.map((tech) => (
          <TechnologyCard key={tech.name} technology={tech} />
        ))}
      </Box>
    </Container>
  );
};

export default TechnologiesPage;
