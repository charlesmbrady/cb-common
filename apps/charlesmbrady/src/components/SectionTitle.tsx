type SectionTitleProps = {
  title: string;
};

export function SectionTitle({ title }: SectionTitleProps): JSX.Element {
  return <h2 className="text-3xl font-semibold mb-4">{title}</h2>;
}
