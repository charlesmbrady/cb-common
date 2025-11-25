import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { projects } from '../data';
import { ProjectCard } from '../components/ProjectCard';
import { PageContainer } from '../components/PageContainer';
import { PageHeader } from '../components/PageHeader';

export const OTHER_PROJECTS_SECTION_ID = 'other-projects';

type ProjectsCardGridProps = {
  projectsList?: typeof projects;
};

export const ProjectsCardGrid = ({
  projectsList = projects,
}: ProjectsCardGridProps) => (
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
    {projectsList.map((project) => (
      <Box key={project.id}>
        <ProjectCard project={project} />
      </Box>
    ))}
  </Box>
);

const ProjectsPage: React.FC = () => {
  const location = useLocation();
  const featuredProjects = projects.filter((project) => project.featured);
  const otherProjects = projects.filter((project) => !project.featured);

  useEffect(() => {
    if (location.hash === `#${OTHER_PROJECTS_SECTION_ID}`) {
      const element = document.getElementById(OTHER_PROJECTS_SECTION_ID);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [location.hash]);

  return (
    <PageContainer>
      <PageHeader title="Featured Projects" />
      <ProjectsCardGrid projectsList={featuredProjects} />
      {otherProjects.length > 0 && (
        <Box id={OTHER_PROJECTS_SECTION_ID} sx={{ mt: 8 }}>
          <Box
            sx={{
              bgcolor: 'background.paper',
              borderRadius: 2,
              py: 2,
              px: 3,
              mb: 4,
              boxShadow: 1,
            }}
          >
            <Typography variant="h3" sx={{ textAlign: 'center', m: 0 }}>
              Other Projects
            </Typography>
          </Box>
          <ProjectsCardGrid projectsList={otherProjects} />
        </Box>
      )}
    </PageContainer>
  );
};

export default ProjectsPage;
