import { InlineText } from "../../../components/admin/inline/InlineText";
import { InlineTitleDescList } from "../../../components/admin/inline/InlineTitleDescList";
import type { PageSectionContent } from "../../../types/page";

export function EditableProcessAccordionSection({
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

  return (
    <section className="bg-white px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <InlineText
            value={eyebrow}
            placeholder="Eyebrow matni"
            onCommit={(v) => onFieldChange("eyebrow", v)}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--rt-brand-primary)]"
          />
          <h2 className="mt-4 text-3xl font-bold leading-tight text-[#294A34] sm:text-4xl">
            <InlineText value={title} placeholder="Sarlavha" onCommit={(v) => onFieldChange("title", v)} />
          </h2>
          <InlineText
            value={subtitle}
            placeholder="Tasvir matni"
            multiline
            onCommit={(v) => onFieldChange("subtitle", v)}
            className="mx-auto mt-4 block max-w-2xl text-base text-taupe sm:text-lg"
          />
        </div>

        <InlineTitleDescList
          items={steps}
          onChange={(v) => onFieldChange("steps", v)}
          gridClassName="mt-10 divide-y divide-herb/50 rounded-2xl border border-herb/50 [&>*]:rounded-none [&>*]:border-0"
        />
      </div>
    </section>
  );
}
