import { Project } from './types';

export type { Project };

export const projects: Project[] = [
  {
    id: '1',
    title: 'E-commerce Platform',
    description: 'A full-stack e-commerce platform built with Next.js and Node.js. Features include user authentication, product management, shopping cart, and payment processing.',
    thumbnail: '/images/projects/ecommerce-thumbnail.jpg',
    tags: ['Next.js', 'Node.js', 'MongoDB', 'Stripe', 'Material-UI'],
    githubLink: 'https://github.com/username/ecommerce',
    demoLink: 'https://ecommerce-demo.com',
    youtubeLink: 'https://youtu.be/AGJjvxJdOjs?si=uYtQfpaKdibSzNTe',
  },
  {
    id: '2',
    title: 'Task Management App',
    description: 'A collaborative task management application with real-time updates and team collaboration features.',
    thumbnail: '/images/projects/task-manager-thumbnail.jpg',
    tags: ['React', 'Firebase', 'Redux', 'Material-UI'],
    githubLink: 'https://github.com/username/task-manager',
    demoLink: 'https://task-manager-demo.com',
    youtubeLink: 'https://youtu.be/CaAn4yNo-t8?si=ky_zgELflCfQJO4q',
  },
  {
    id: '3',
    title: 'Weather Dashboard',
    description: 'A weather dashboard that displays current weather conditions and forecasts using multiple weather APIs.',
    thumbnail: '/images/projects/weather-dashboard-thumbnail.jpg',
    tags: ['React', 'OpenWeather API', 'Chart.js', 'Tailwind CSS'],
    githubLink: 'https://github.com/username/weather-dashboard',
    demoLink: 'https://weather-dashboard-demo.com',
    youtubeLink: 'https://youtu.be/AGJjvxJdOjs?si=uYtQfpaKdibSzNTe',
  },
];

export default projects; 