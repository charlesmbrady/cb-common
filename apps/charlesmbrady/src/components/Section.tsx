type SectionProps = {
  children: React.ReactNode;
};

export function Section({ children }: SectionProps): JSX.Element {
  return (
    <section className="bg-gray-800 p-8 rounded-lg shadow-lg">
      {children}
    </section>
  );
}
