import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { workExperiences } from '../data/workExperiences';
import { WorkExperienceCard } from '../components/WorkExperienceCard';

const WorkPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom sx={{ textAlign: 'center', mb: 6 }}>
        Work Experience
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {workExperiences.map((experience) => (
          <WorkExperienceCard key={experience.id} experience={experience} />
        ))}
      </Box>
    </Container>
  );
};

export default WorkPage;
