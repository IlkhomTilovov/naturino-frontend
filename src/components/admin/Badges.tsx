import type { SeoReport } from "../../lib/utils/seo";

export function ProductStatusBadge({ isActive }: { isActive: boolean }) {
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

export function StockBadge({ stockQuantity }: { stockQuantity: number }) {
  const inStock = stockQuantity > 0;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${
        inStock ? "border-admin-accent/30 bg-admin-accent-50 text-admin-accent" : "border-admin-danger/30 bg-admin-danger-50 text-admin-danger"
      }`}
    >
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

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${styles[report.label]}`} title={report.issues.map((i) => i.message).join("\n") || "Barcha SEO talablar bajarilgan"}>
      {report.label}
    </span>
  );
}
