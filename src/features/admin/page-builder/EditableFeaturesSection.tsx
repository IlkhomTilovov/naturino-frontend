import { InlineText } from "../../../components/admin/inline/InlineText";
import type { PageSectionContent } from "../../../types/page";

export function EditableFeaturesSection({
  content,
  onFieldChange,
}: {
  content: PageSectionContent;
  onFieldChange: (key: string, value: unknown) => void;
}) {
  const eyebrow = content.eyebrow as string | undefined;
  const title = content.title as string | undefined;
  const subtitle = content.subtitle as string | undefined;

  return (
    <section className="mx-auto max-w-3xl px-6 py-16 text-center">
      <InlineText
        value={eyebrow}
        placeholder="Eyebrow matni"
        onCommit={(v) => onFieldChange("eyebrow", v)}
        className="text-xs font-semibold uppercase tracking-wide text-[var(--rt-brand-primary)]"
      />
      <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
        <InlineText value={title} placeholder="Sarlavha" onCommit={(v) => onFieldChange("title", v)} />
      </h2>
      <InlineText
        value={subtitle}
        placeholder="Matn"
        multiline
        onCommit={(v) => onFieldChange("subtitle", v)}
        className="mt-5 block text-slate-600"
      />
    </section>
  );
}
