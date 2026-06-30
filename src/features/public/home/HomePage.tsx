import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { pagesApi } from "../../../api/endpoints/pages";
import { renderSection, getSectionTypeName } from "../shared/renderSection";
import { HeroSection } from "./sections/HeroSection";
import { useLanguage } from "../../../i18n/LanguageContext";
import { getLocalized, type ContentLanguage } from "../../../lib/page/localizedContent";

export function HomePage() {
  const { language } = useLanguage();
  const lang: ContentLanguage = language;

  const { data: page, isLoading } = useQuery({
    queryKey: ["page", "by-slug", ""],
    queryFn: () => pagesApi.getBySlug(""),
  });

  if (isLoading) {
    return <div className="px-6 py-24 text-center text-slate-400">Yuklanmoqda...</div>;
  }

  const sections = (page?.sections ?? [])
    .filter((s) => s.isEnabled)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <>
      <Helmet>
        <title>Naturino — Mushuklar uchun premium ovqat</title>
        <meta name="description" content="Naturino — mushuklar uchun tabiiy va sifatli ovqat ishlab chiqaruvchi." />
      </Helmet>

      {sections.map((section) => {
        if (getSectionTypeName(section.sectionType) !== "Hero") return renderSection(section, lang);
        const content = getLocalized(section.content, lang);
        return <HeroSection key={section.id} content={content} enableScrollFrames={Boolean(content.enableScrollFrames)} />;
      })}

      {sections.length === 0 && (
        <div className="px-6 py-24 text-center text-slate-400">
          Bosh sahifa bo'limlari admin panelda hali sozlanmagan.
        </div>
      )}
    </>
  );
}
