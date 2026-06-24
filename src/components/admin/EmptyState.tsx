export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl text-admin-muted">
        ⌀
      </div>
      <p className="font-medium text-admin-primary">{title}</p>
      {description && <p className="max-w-sm text-sm text-admin-muted">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
