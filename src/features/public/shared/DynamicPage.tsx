import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { pagesApi } from "../../../api/endpoints/pages";
import { renderSection } from "./renderSection";
import { useLanguage } from "../../../i18n/LanguageContext";
import type { ContentLanguage } from "../../../lib/page/localizedContent";

export function DynamicPage({ slug, fallbackTitle }: { slug: string; fallbackTitle: string }) {
  const { language } = useLanguage();
  const lang: ContentLanguage = language === "ru" ? "ru" : "uz";

  const { data: page, isLoading, isError } = useQuery({
    queryKey: ["page", "by-slug", slug],
    queryFn: () => pagesApi.getBySlug(slug),
  });

  if (isLoading) {
    return <div className="px-6 py-24 text-center text-slate-400">Yuklanmoqda...</div>;
  }

  const sections = (page?.sections ?? []).filter((s) => s.isEnabled).sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <>
      <Helmet>
        <title>{page?.title ?? fallbackTitle} — Naturino</title>
      </Helmet>

      {sections.map((section) => renderSection(section, lang))}

      {(isError || sections.length === 0) && (
        <div className="px-6 py-24 text-center text-slate-400">
          "{fallbackTitle}" sahifasi bo'limlari admin panelda hali to'ldirilmagan.
        </div>
      )}
    </>
  );
}
