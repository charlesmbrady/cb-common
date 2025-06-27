import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { workExperiences } from '../../components/workData';
import { WorkExperienceCard } from '../../components/WorkExperienceCard';

const Work: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="body1" paragraph>
        Throughout my career, I've had the opportunity to work on diverse
        projects and collaborate with talented teams. Here's a snapshot of my
        professional journey:
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {workExperiences.map((experience) => (
          <Box key={experience.id}>
            <WorkExperienceCard experience={experience} />
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default Work;
