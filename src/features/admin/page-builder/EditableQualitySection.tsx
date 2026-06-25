import { InlineText } from "../../../components/admin/inline/InlineText";
import { InlineChecklist } from "../../../components/admin/inline/InlineChecklist";
import { InlineImage } from "../../../components/admin/inline/InlineImage";
import type { PageSectionContent } from "../../../types/page";

export function EditableQualitySection({
  content,
  onFieldChange,
}: {
  content: PageSectionContent;
  onFieldChange: (key: string, value: unknown) => void;
}) {
  const eyebrow = content.eyebrow as string | undefined;
  const title = content.title as string | undefined;
  const subtitle = content.subtitle as string | undefined;
  const items = (content.items as string[] | undefined) ?? [];
  const imageUrl = content.imageUrl as string | undefined;

  return (
    <section className="bg-[#F8F9F4] px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div className="overflow-hidden rounded-[28px] shadow-[0_15px_40px_rgba(0,0,0,0.08)]">
          <InlineImage imageUrl={imageUrl} alt={title} className="h-80 w-full object-cover sm:h-96" onChange={(url) => onFieldChange("imageUrl", url)} />
        </div>

        <div>
          <InlineText
            value={eyebrow}
            placeholder="Eyebrow matni"
            onCommit={(v) => onFieldChange("eyebrow", v)}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--rt-brand-secondary)]"
          />
          <h2 className="mt-4 text-2xl font-bold leading-tight text-[#0F172A] sm:text-3xl">
            <InlineText value={title} placeholder="Sarlavha" onCommit={(v) => onFieldChange("title", v)} />
          </h2>
          <InlineText
            value={subtitle}
            placeholder="Matn"
            multiline
            onCommit={(v) => onFieldChange("subtitle", v)}
            className="mt-3 block text-slate-600"
          />

          <div className="mt-6 flex flex-wrap gap-2.5">
            <InlineChecklist items={items} onChange={(v) => onFieldChange("items", v)} />
          </div>
        </div>
      </div>
    </section>
  );
}
