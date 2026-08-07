import { InlineText } from "../../../components/admin/inline/InlineText";
import { InlineStatList } from "../../../components/admin/inline/InlineStatList";
import type { PageSectionContent } from "../../../types/page";

export function EditableWhyPartnerMetricsSection({
  content,
  onFieldChange,
}: {
  content: PageSectionContent;
  onFieldChange: (key: string, value: unknown) => void;
}) {
  const eyebrow = content.eyebrow as string | undefined;
  const title = content.title as string | undefined;
  const subtitle = content.subtitle as string | undefined;
  const metrics = (content.metrics as Record<string, unknown>[] | undefined) ?? [];

  return (
    <section className="bg-[#294A34] px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-5xl text-center">
        <InlineText
          value={eyebrow}
          placeholder="Eyebrow matni"
          onCommit={(v) => onFieldChange("eyebrow", v)}
          className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--rt-accent)]"
        />
        <h2 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl">
          <InlineText value={title} placeholder="Sarlavha" onCommit={(v) => onFieldChange("title", v)} />
        </h2>
        <InlineText
          value={subtitle}
          placeholder="Tasvir matni"
          multiline
          onCommit={(v) => onFieldChange("subtitle", v)}
          className="mx-auto mt-4 block max-w-2xl text-base text-white/70 sm:text-lg"
        />

        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-8 sm:grid-cols-4">
          <InlineStatList
            items={metrics}
            onChange={(v) => onFieldChange("metrics", v)}
            valueClassName="block text-4xl font-extrabold text-white sm:text-5xl"
            labelClassName="mt-2 block text-sm text-white/60"
            addButtonClassName="col-span-2 flex items-center justify-center gap-1 rounded-md border border-dashed border-white/40 px-2 py-1.5 text-xs font-medium text-white/70 transition-colors hover:border-white hover:text-white sm:col-span-4"
          />
        </div>
      </div>
    </section>
  );
}
