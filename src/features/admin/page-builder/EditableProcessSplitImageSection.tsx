import { InlineText } from "../../../components/admin/inline/InlineText";
import { InlineImage } from "../../../components/admin/inline/InlineImage";
import { InlineTitleDescList } from "../../../components/admin/inline/InlineTitleDescList";
import { bgVariantClasses } from "../../../lib/utils/sectionBgVariant";
import type { PageSectionContent } from "../../../types/page";

export function EditableProcessSplitImageSection({
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
  const imageUrl = content.imageUrl as string | undefined;
  const bg = bgVariantClasses(content.bgVariant as string | undefined, "bg-white");

  return (
    <section className={`${bg.section} px-4 py-20 sm:px-6 sm:py-24`}>
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div className="overflow-hidden rounded-[28px] shadow-[0_15px_40px_rgba(0,0,0,0.08)]">
          <InlineImage
            imageUrl={imageUrl}
            alt={title}
            className="h-80 w-full object-cover sm:h-[28rem]"
            onChange={(url) => onFieldChange("imageUrl", url)}
          />
        </div>

        <div>
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
            className={`mt-3 block ${bg.body}`}
          />

          <InlineTitleDescList items={steps} onChange={(v) => onFieldChange("steps", v)} gridClassName="mt-6 space-y-3" />
        </div>
      </div>
    </section>
  );
}
