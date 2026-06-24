import type { Page } from "../../types/page";

export interface PageSeoCheck {
  label: string;
  passed: boolean;
}

export interface PageSeoReport {
  score: number;
  checks: PageSeoCheck[];
  previewTitle: string;
  previewDescription: string;
}

export function computePageSeoScore(page: Page): PageSeoReport {
  const fallbackSection = page.sections.find((s) => s.isEnabled && (s.content.title || s.content.subtitle));
  const fallbackTitle = (fallbackSection?.content.title as string | undefined) ?? page.title;
  const fallbackDescription = (fallbackSection?.content.subtitle as string | undefined) ?? "";

  const previewTitle = page.metaTitle || fallbackTitle;
  const previewDescription = page.metaDescription || fallbackDescription;

  const checks: PageSeoCheck[] = [
    { label: "Meta title to'ldirilgan", passed: Boolean(page.metaTitle?.trim()) },
    { label: "Meta description to'ldirilgan", passed: Boolean(page.metaDescription?.trim()) },
    { label: "Open Graph rasm yuklangan", passed: Boolean(page.ogImageUrl) },
    { label: "Indexlash yoqilgan", passed: page.isIndexable },
    { label: "Kamida bitta bo'lim faol", passed: page.sections.some((s) => s.isEnabled) },
  ];

  const score = Math.round((checks.filter((c) => c.passed).length / checks.length) * 100);

  return { score, checks, previewTitle, previewDescription };
}
