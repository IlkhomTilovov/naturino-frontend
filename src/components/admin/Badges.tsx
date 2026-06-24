import { CheckCircle2, CircleOff, CircleX, TriangleAlert } from "lucide-react";
import type { SeoReport } from "../../lib/utils/seo";

export function ProductStatusBadge({ isActive }: { isActive: boolean }) {
  const Icon = isActive ? CheckCircle2 : CircleOff;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        isActive ? "bg-admin-primary text-white" : "bg-slate-100 text-admin-muted"
      }`}
    >
      <Icon strokeWidth={1.8} className="h-3.5 w-3.5" />
      {isActive ? "Faol" : "Faol emas"}
    </span>
  );
}

export function StockBadge({ stockQuantity }: { stockQuantity: number }) {
  const inStock = stockQuantity > 0;
  const Icon = inStock ? CheckCircle2 : CircleX;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${
        inStock ? "border-admin-accent/30 bg-admin-accent-50 text-admin-accent" : "border-admin-danger/30 bg-admin-danger-50 text-admin-danger"
      }`}
    >
      <Icon strokeWidth={1.8} className="h-3.5 w-3.5" />
      {inStock ? "Mavjud" : "Tugagan"}
    </span>
  );
}

export function SeoStatusBadge({ report }: { report: SeoReport }) {
  const styles: Record<SeoReport["label"], string> = {
    "SEO tayyor": "bg-admin-primary text-white",
    Yaxshi: "border border-admin-accent/30 bg-admin-accent-50 text-admin-accent",
    "O'rtacha": "border border-admin-warning/30 bg-admin-warning-50 text-admin-warning",
    Zaif: "border border-admin-danger/30 bg-admin-danger-50 text-admin-danger",
  };
  const icons: Record<SeoReport["label"], typeof CheckCircle2> = {
    "SEO tayyor": CheckCircle2,
    Yaxshi: CheckCircle2,
    "O'rtacha": TriangleAlert,
    Zaif: CircleX,
  };
  const Icon = icons[report.label];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${styles[report.label]}`} title={report.issues.map((i) => i.message).join("\n") || "Barcha SEO talablar bajarilgan"}>
      <Icon strokeWidth={1.8} className="h-3.5 w-3.5" />
      {report.label}
    </span>
  );
}
