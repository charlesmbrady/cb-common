export interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  tags: string[];
  githubLink?: string;
  demoLink?: string;
  youtubeLink?: string;
} 

export interface Technology {
  name: string;
  category: string;
  logo: string;
  url: string;
}
