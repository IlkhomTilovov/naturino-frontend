import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router-dom";
import { pagesApi } from "../../../api/endpoints/pages";
import { renderSection, SECTION_TYPE_NAMES } from "./renderSection";
import { useLanguage } from "../../../i18n/LanguageContext";
import type { ContentLanguage } from "../../../lib/page/localizedContent";
import { CategoryTabsSection } from "../home/sections/CategoryTabsSection";

export function DynamicPage({ slug, fallbackTitle }: { slug: string; fallbackTitle: string }) {
  const { language } = useLanguage();
  const lang: ContentLanguage = language;
  // Reached via the "Zavodchilarga" tab from within a category — keep that
  // tab bar visible (alongside the main navbar) so the visitor doesn't lose
  // the category context, instead of landing on a bare standalone page.
  const [searchParams] = useSearchParams();
  const fromCategory = searchParams.get("fromCategory") ?? undefined;
  const fromTab = searchParams.get("fromTab") || undefined;

  const { data: page, isLoading, isError } = useQuery({
    queryKey: ["page", "by-slug", slug],
    queryFn: () => pagesApi.getBySlug(slug),
  });

  if (isLoading) {
    return <div className="px-6 py-24 text-center text-taupe">Yuklanmoqda...</div>;
  }

  const sections = (page?.sections ?? [])
    .filter((s) => s.isEnabled)
    // Reached via Zavodchilarga, the category tab bar above already covers
    // "which category" — the page's own Hero (the same category-picker bento
    // grid the homepage uses) would just repeat that choice, so skip it here.
    .filter((s) => !fromCategory || (SECTION_TYPE_NAMES[Number(s.sectionType)] ?? "") !== "Hero")
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const categoryBackPath = fromCategory ? (fromTab ? `/categories/${fromCategory}/${fromTab}` : `/categories/${fromCategory}`) : null;

  return (
    <>
      <Helmet>
        <title>{page?.title ?? fallbackTitle} — Naturino</title>
      </Helmet>

      {fromCategory && <CategoryTabsSection categorySlug={fromCategory} activeTab="zavodchilarga" />}

      <div className="relative">
        {categoryBackPath && (
          <div className="absolute inset-x-0 top-0 z-10 mx-auto max-w-[1400px] px-4 pt-4 sm:px-6">
            <Link
              to={categoryBackPath}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#294A34]/70 transition-colors hover:text-[var(--rt-brand-primary)]"
            >
              ← Orqaga
            </Link>
          </div>
        )}

        {sections.map((section) => renderSection(section, lang))}
      </div>

      {(isError || sections.length === 0) && (
        <div className="px-6 py-24 text-center text-taupe">
          "{fallbackTitle}" sahifasi bo'limlari admin panelda hali to'ldirilmagan.
        </div>
      )}
    </>
  );
}
