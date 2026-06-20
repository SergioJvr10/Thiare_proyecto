type PageHeaderProps = {
  title: string;
  description?: string;
};

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="mb-6">
      <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
        {title}
      </h1>
      {description && (
        <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">{description}</p>
      )}
    </header>
  );
}
