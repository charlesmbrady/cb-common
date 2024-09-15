// src/pages/Projects.tsx

import { PageContent } from '../components/PageContent';
import { PageHeader } from '../components/PageHeader';
import { ProjectCard } from '../components/ProjectCard';

export type Project = {
  title: string;
  description: string;
  codeLink: string;
  demoLink: string;
  tags: string[];
};

/* ----------------------------- Define Projects ---------------------------- */
const projectArr: Project[] = [
  {
    title: 'Project 1',
    description: 'This is a project description.',
    codeLink: 'http://localhost:3000',
    demoLink: 'http://localhost:3000',
    tags: ['React', 'TypeScript'],
  },
  {
    title: 'Project 2',
    description: 'This is a project description.',
    codeLink: 'http://localhost:3000',
    demoLink: 'http://localhost:3000',
    tags: ['React', 'TypeScript'],
  },
  {
    title: 'Project 3',
    description: 'This is a project description.',
    codeLink: 'http://localhost:3000',
    demoLink: 'http://localhost:3000',
    tags: ['React', 'TypeScript'],
  },
  {
    title: 'Project 4',
    description: 'This is a project description.',
    codeLink: 'http://localhost:3000',
    demoLink: 'http://localhost:3000',
    tags: ['React', 'TypeScript'],
  },
];

/* -------------------------------------------------------------------------- */
/*                                    Main                                    */
/* -------------------------------------------------------------------------- */
export default function ProjectsPage(): JSX.Element {
  return (
    <PageContent>
      {/* Header */}
      <PageHeader
        title={'Projects'}
        description={
          'Here are some of the projects I’ve worked on. Check out the code, demos, and details below.'
        }
      />

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {projectArr?.map((project) => (
          <ProjectCard key={project.title} {...project} />
        ))}
      </div>
    </PageContent>
  );
}
