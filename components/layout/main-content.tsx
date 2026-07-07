interface MainContentProps {
  children: React.ReactNode;
  title?: string;
}

export function MainContent({ children, title }: MainContentProps) {
  return (
    <div className="space-y-6">
      {title && (
        <h1 className="text-2xl font-heading font-semibold tracking-tight text-foreground">
          {title}
        </h1>
      )}
      {children}
    </div>
  );
}
