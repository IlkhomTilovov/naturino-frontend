import { Inbox, type LucideIcon } from "lucide-react";

export function EmptyState({
  title,
  description,
  action,
  icon: Icon = Inbox,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: LucideIcon;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-admin-muted">
        <Icon strokeWidth={1.8} className="h-8 w-8" />
      </div>
      <p className="font-medium text-admin-primary">{title}</p>
      {description && <p className="max-w-sm text-sm text-admin-muted">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
