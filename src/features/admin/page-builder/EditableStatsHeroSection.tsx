import { InlineText } from "../../../components/admin/inline/InlineText";
import { InlineStatList } from "../../../components/admin/inline/InlineStatList";
import type { PageSectionContent } from "../../../types/page";

interface StatItem {
  value?: string;
  label?: string;
}

export function EditableStatsHeroSection({
  content,
  onFieldChange,
}: {
  content: PageSectionContent;
  onFieldChange: (key: string, value: unknown) => void;
}) {
  const eyebrow = content.eyebrow as string | undefined;
  const title = content.title as string | undefined;
  const subtitle = content.subtitle as string | undefined;
  const buttonText = content.buttonText as string | undefined;
  const stats = (content.stats as StatItem[] | undefined) ?? [];

  return (
    <section className="px-6 py-16 sm:py-20" style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #F3EDE1 100%)" }}>
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--rt-brand-primary)]">
          <InlineText value={eyebrow} placeholder="Eyebrow matni" onCommit={(v) => onFieldChange("eyebrow", v)} />
        </p>
        <h1 className="mt-3 text-4xl font-extrabold leading-[1.1] tracking-tight text-[#294A34] sm:text-5xl">
          <InlineText value={title} placeholder="Sarlavha" multiline onCommit={(v) => onFieldChange("title", v)} />
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-taupe sm:text-lg">
          <InlineText value={subtitle} placeholder="Tasvir matni" multiline onCommit={(v) => onFieldChange("subtitle", v)} />
        </p>
        <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--rt-brand-primary)] px-6 py-3 text-sm font-semibold text-white">
          <InlineText value={buttonText} placeholder="Tugma matni" onCommit={(v) => onFieldChange("buttonText", v)} />
        </div>

        <div className="mt-12 grid grid-cols-2 gap-6 border-t border-[#E7EBDD] pt-10 sm:grid-cols-4">
          <InlineStatList
            items={stats}
            onChange={(items) => onFieldChange("stats", items)}
            valueClassName="block text-3xl font-extrabold text-[#294A34]"
            labelClassName="mt-1 block text-xs font-medium uppercase tracking-wide text-taupe"
            addButtonClassName="flex h-fit items-center gap-1 self-center rounded-md border border-dashed border-[#294A34]/30 px-2 py-1.5 text-xs font-medium text-[#294A34]/70 transition-colors hover:border-[#294A34] hover:text-[#294A34]"
          />
        </div>
      </div>
    </section>
  );
}
