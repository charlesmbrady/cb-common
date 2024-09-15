type ProjectCardProps = {
  title: string;
  description: string;
  codeLink: string;
  demoLink: string;
  tags: string[];
};

export function ProjectCard({
  title,
  description,
  codeLink,
  demoLink,
  tags,
}: ProjectCardProps): JSX.Element {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <p className="text-gray-400 mb-4">{description}</p>

      {/* Links */}
      <div className="flex space-x-4 mb-4">
        <a
          href={codeLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-400 hover:underline"
        >
          View Code
        </a>
        <a
          href={demoLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-400 hover:underline"
        >
          Watch Demo
        </a>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap space-x-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="bg-indigo-500 text-xs px-2 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
