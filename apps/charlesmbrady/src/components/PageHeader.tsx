type PageHeaderProps = {
  title: string;
  description: string;
};

export function PageHeader({
  title,
  description,
}: PageHeaderProps): JSX.Element {
  return (
    <header className="text-center mb-16">
      <h1 className="text-4xl md:text-6xl font-bold mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-gray-300">{description}</p>
    </header>
  );
}
