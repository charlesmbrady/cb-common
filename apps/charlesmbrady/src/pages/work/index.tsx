import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
} from '@mui/material';
import { workExperiences } from '../../components/workData';
import { WorkExperienceCard } from '../../components/WorkExperienceCard';

const Work: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="body1" paragraph>
        Throughout my career, I've had the opportunity to work on diverse projects
        and collaborate with talented teams. Here's a snapshot of my professional
        journey:
      </Typography>

      <Grid container spacing={4}>
        {workExperiences.map(experience => (
          <Grid item xs={12} key={experience.id}>
            <WorkExperienceCard experience={experience} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Work;
