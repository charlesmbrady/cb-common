import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { projects } from '../data/projects';
import { ProjectCard } from '../components/ProjectCard';

const ProjectsPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom sx={{ textAlign: 'center', mb: 6 }}>
        Featured Projects
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr 1fr',
            md: '1fr 1fr 1fr',
          },
          gap: 4,
        }}
      >
        {projects.map((project) => (
          <Box key={project.id}>
            <ProjectCard project={project} />
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default ProjectsPage;
