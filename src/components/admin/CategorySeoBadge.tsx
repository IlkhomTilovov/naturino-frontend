import { categorySeoLabel } from "../../lib/utils/categorySeo";

export function CategorySeoBadge({ score }: { score: number }) {
  const { label, tone } = categorySeoLabel(score);

  const styles: Record<typeof tone, string> = {
    ready: "bg-admin-primary text-white",
    partial: "border border-admin-warning/30 bg-admin-warning-50 text-admin-warning",
    missing: "border border-slate-200 bg-slate-50 text-admin-muted",
  };

  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${styles[tone]}`}>{label}</span>;
}

export function CategoryStatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
        isActive ? "bg-admin-primary text-white" : "bg-slate-100 text-admin-muted"
      }`}
    >
      {isActive ? "Faol" : "Faol emas"}
    </span>
  );
}
