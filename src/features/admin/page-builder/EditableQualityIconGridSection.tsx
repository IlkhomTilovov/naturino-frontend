import { InlineText } from "../../../components/admin/inline/InlineText";
import { InlineIconCardGrid } from "../../../components/admin/inline/InlineIconCardGrid";
import { bgVariantClasses } from "../../../lib/utils/sectionBgVariant";
import type { PageSectionContent } from "../../../types/page";

export function EditableQualityIconGridSection({
  content,
  onFieldChange,
}: {
  content: PageSectionContent;
  onFieldChange: (key: string, value: unknown) => void;
}) {
  const eyebrow = content.eyebrow as string | undefined;
  const title = content.title as string | undefined;
  const subtitle = content.subtitle as string | undefined;
  const items = (content.items as Record<string, unknown>[] | undefined) ?? [];
  const bg = bgVariantClasses(content.bgVariant as string | undefined, "bg-white");

  return (
    <section className={`${bg.section} px-4 py-20 sm:px-6 sm:py-24`}>
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <InlineText
            value={eyebrow}
            placeholder="Eyebrow matni"
            onCommit={(v) => onFieldChange("eyebrow", v)}
            className={`text-xs font-semibold uppercase tracking-[0.2em] ${bg.eyebrow}`}
          />
          <h2 className={`mt-4 text-3xl font-bold leading-tight sm:text-4xl ${bg.heading}`}>
            <InlineText value={title} placeholder="Sarlavha" onCommit={(v) => onFieldChange("title", v)} />
          </h2>
          <InlineText
            value={subtitle}
            placeholder="Tasvir matni"
            multiline
            onCommit={(v) => onFieldChange("subtitle", v)}
            className={`mx-auto mt-4 block max-w-2xl text-base sm:text-lg ${bg.body}`}
          />
        </div>

        <InlineIconCardGrid
          cards={items}
          onChange={(v) => onFieldChange("items", v)}
          iconHint="shield/badge/award/leaf/beaker/sparkles"
          gridClassName="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        />
      </div>
    </section>
  );
}
