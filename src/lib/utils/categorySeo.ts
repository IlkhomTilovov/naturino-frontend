import type { ProductCategoryFormValues } from "../../types/product";

export interface CategorySeoCheck {
  label: string;
  passed: boolean;
}

export interface CategorySeoReport {
  score: number;
  checks: CategorySeoCheck[];
}

type SeoFields = {
  metaTitleUz?: string | null;
  metaTitleRu?: string | null;
  metaDescriptionUz?: string | null;
  metaDescriptionRu?: string | null;
  metaKeywords?: string | null;
  isIndexable: boolean;
  slug?: string | null;
};

// Re-exported so callers can build the field set from either form values or API DTOs.
export type { ProductCategoryFormValues };

export function computeCategorySeoScore(fields: SeoFields): CategorySeoReport {
  const checks: CategorySeoCheck[] = [
    { label: "Meta title (UZ)", passed: Boolean(fields.metaTitleUz?.trim()) },
    { label: "Meta description (UZ)", passed: Boolean(fields.metaDescriptionUz?.trim()) },
    { label: "Kalit so'zlar", passed: Boolean(fields.metaKeywords?.trim()) },
    { label: "Indexlash yoqilgan", passed: fields.isIndexable },
    { label: "Slug to'g'ri formatlangan", passed: Boolean(fields.slug && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(fields.slug)) },
  ];

  const passedCount = checks.filter((c) => c.passed).length;
  const score = Math.round((passedCount / checks.length) * 100);

  return { score, checks };
}

export function categorySeoLabel(score: number): { label: string; tone: "ready" | "partial" | "missing" } {
  if (score >= 80) return { label: "SEO Ready", tone: "ready" };
  if (score >= 40) return { label: `SEO ${score}%`, tone: "partial" };
  return { label: "SEO Missing", tone: "missing" };
}
