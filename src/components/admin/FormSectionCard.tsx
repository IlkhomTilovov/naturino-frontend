import type { ReactNode } from "react";

export function FormSectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-admin-border bg-white p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-admin-primary">{title}</h3>
        {description && <p className="mt-0.5 text-xs text-admin-muted">{description}</p>}
      </div>
      {children}
    </div>
  );
}
