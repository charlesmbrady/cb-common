import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { projects } from '../../components/projectDefinitions';
import { ProjectCard } from '../../components/ProjectCard';

const Projects: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box>
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </Box>
    </Container>
  );
};

export default Projects;
