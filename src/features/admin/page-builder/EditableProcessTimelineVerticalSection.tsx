import { InlineText } from "../../../components/admin/inline/InlineText";
import { InlineTitleDescList } from "../../../components/admin/inline/InlineTitleDescList";
import { bgVariantClasses } from "../../../lib/utils/sectionBgVariant";
import type { PageSectionContent } from "../../../types/page";

export function EditableProcessTimelineVerticalSection({
  content,
  onFieldChange,
}: {
  content: PageSectionContent;
  onFieldChange: (key: string, value: unknown) => void;
}) {
  const eyebrow = content.eyebrow as string | undefined;
  const title = content.title as string | undefined;
  const subtitle = content.subtitle as string | undefined;
  const steps = (content.steps as Record<string, unknown>[] | undefined) ?? [];
  const bg = bgVariantClasses(content.bgVariant as string | undefined, "default", "bg-white");

  return (
    <section className={`${bg.section} px-4 py-20 sm:px-6 sm:py-24`}>
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
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

        <InlineTitleDescList
          items={steps}
          onChange={(v) => onFieldChange("steps", v)}
          gridClassName="mt-12 space-y-3"
        />
      </div>
    </section>
  );
}
