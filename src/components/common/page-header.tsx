export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-8">
      {eyebrow && (
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-gold">{eyebrow}</p>
      )}
      <h1 className="font-display text-3xl font-semibold sm:text-4xl">{title}</h1>
      {description && (
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">{description}</p>
      )}
      <div className="mt-4 h-px w-12 bg-gold" />
    </div>
  );
}

