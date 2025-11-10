import React from 'react';
import { Box } from '@mui/material';
import { projects } from '../data';
import { ProjectCard } from '../components/ProjectCard';
import { PageContainer } from '../components/PageContainer';
import { PageHeader } from '../components/PageHeader';

export const ProjectsCardGrid = () => (
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
);

const ProjectsPage: React.FC = () => {
  return (
    <PageContainer>
      <PageHeader title="Featured Projects" />
      <ProjectsCardGrid />
    </PageContainer>
  );
};

export default ProjectsPage;
