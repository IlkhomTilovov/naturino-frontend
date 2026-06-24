import { InlineText } from "../../../components/admin/inline/InlineText";
import { InlineChecklist } from "../../../components/admin/inline/InlineChecklist";
import type { PageSectionContent } from "../../../types/page";

export function EditableTrustBarSection({
  content,
  onFieldChange,
}: {
  content: PageSectionContent;
  onFieldChange: (key: string, value: unknown) => void;
}) {
  const eyebrow = content.eyebrow as string | undefined;
  const badges = (content.badges as string[] | undefined) ?? [];
  const highlight = content.highlight as string | undefined;

  return (
    <section className="border-y border-[#E7EBDD] bg-[#F8F9F4] py-12 sm:py-16">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 text-center">
        <InlineText
          value={eyebrow}
          placeholder="Eyebrow matni"
          onCommit={(v) => onFieldChange("eyebrow", v)}
          className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--rt-brand-secondary)]"
        />

        <ul className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <InlineChecklist items={badges} onChange={(v) => onFieldChange("badges", v)} />
        </ul>

        <InlineText
          value={highlight}
          placeholder="Oxirgi ajratilgan matn"
          onCommit={(v) => onFieldChange("highlight", v)}
          className="rounded-full border border-[var(--rt-brand-primary)]/20 bg-white px-5 py-3 text-sm font-semibold text-[#0F172A]"
        />
      </div>
    </section>
  );
}
