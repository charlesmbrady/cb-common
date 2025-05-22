import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { technologies } from '../../components/techData';
import { TechnologyCard } from '../../components/TechnologyCard';

const Technologies: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="body1" paragraph>
        I've built a deep toolkit over the years, with a focus on modern
        JavaScript frameworks and cloud-based architectures. Here's a snapshot
        of the technologies I regularly work with:
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
          <Box key={tech.name}>
            <TechnologyCard technology={tech} />
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default Technologies;
