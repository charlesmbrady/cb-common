import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid,
} from '@mui/material';
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

      <Grid container spacing={3}>
        {technologies.map(tech => (
          <Grid item xs={6} sm={4} md={3} key={tech.name}>
            <TechnologyCard technology={tech} />
          </Grid>
        ))}
      </Grid>

    </Container>
  );
};

export default Technologies;
