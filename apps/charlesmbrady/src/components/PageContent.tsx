type PageContentProps = {
  children: React.ReactNode;
};

export function PageContent({ children }: PageContentProps): JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 text-white font-inter py-12 px-6">
      {children}
    </div>
  );
}
