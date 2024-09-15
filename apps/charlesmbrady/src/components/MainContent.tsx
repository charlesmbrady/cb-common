type MainContentProps = {
  children: React.ReactNode;
};

export function MainContent({ children }: MainContentProps): JSX.Element {
  return <div className="max-w-5xl mx-auto space-y-12">{children}</div>;
}
