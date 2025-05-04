export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  period: string;
  description: string;
  achievements: string[];
  technologies: string[];
}

export const workExperiences: WorkExperience[] = [
  {
    id: '1',
    company: 'Amazon Web Services (AWS)',
    position: 'Senior Software Development Engineer',
    location: 'Seattle, WA',
    period: '2021 - Present',
    description: 'Leading development of cloud-based solutions and services.',
    achievements: [
      'Architected and implemented scalable cloud solutions',
      'Led cross-functional teams in developing new features',
      'Optimized system performance and reduced costs',
      'Implemented CI/CD pipelines and automated testing'
    ],
    technologies: ['AWS', 'Node.js', 'React', 'TypeScript', 'Docker', 'Terraform']
  },
  {
    id: '2',
    company: 'Microsoft',
    position: 'Software Engineer II',
    location: 'Redmond, WA',
    period: '2018 - 2021',
    description: 'Developed enterprise-level applications and services.',
    achievements: [
      'Built and maintained large-scale web applications',
      'Implemented microservices architecture',
      'Improved system reliability and performance',
      'Mentored junior developers'
    ],
    technologies: ['C#', '.NET', 'Azure', 'SQL Server', 'React', 'TypeScript']
  },
  {
    id: '3',
    company: 'Google',
    position: 'Software Engineer',
    location: 'Mountain View, CA',
    period: '2015 - 2018',
    description: 'Worked on cloud infrastructure and developer tools.',
    achievements: [
      'Developed internal tools and platforms',
      'Contributed to open-source projects',
      'Implemented security best practices',
      'Optimized resource utilization'
    ],
    technologies: ['Go', 'Python', 'Kubernetes', 'GCP', 'Docker', 'Terraform']
  }
]; 