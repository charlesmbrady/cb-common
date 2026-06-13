import React, { useEffect } from 'react';
import { Box } from '@mui/material';
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
        md:
          projectsList.length >= 3
            ? '1fr 1fr 1fr'
            : `repeat(${Math.max(projectsList.length, 1)}, minmax(0, 420px))`,
      },
      justifyContent: 'center',
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
      <PageHeader title="Featured Projects" overline="Portfolio" />
      <ProjectsCardGrid projectsList={featuredProjects} />
      {otherProjects.length > 0 && (
        <Box
          id={OTHER_PROJECTS_SECTION_ID}
          sx={{ mt: 10, scrollMarginTop: 96 }}
        >
          <PageHeader title="Other Projects" />
          <ProjectsCardGrid projectsList={otherProjects} />
        </Box>
      )}
    </PageContainer>
  );
};

export default ProjectsPage;
