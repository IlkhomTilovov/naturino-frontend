import { InlineText } from "../../../components/admin/inline/InlineText";
import { InlineChecklist } from "../../../components/admin/inline/InlineChecklist";
import type { PageSectionContent } from "../../../types/page";

export function EditableCtaSection({
  content,
  onFieldChange,
}: {
  content: PageSectionContent;
  onFieldChange: (key: string, value: unknown) => void;
}) {
  const title = content.title as string | undefined;
  const highlight = content.highlight as string | undefined;
  const titleEnd = content.titleEnd as string | undefined;
  const subtitle = content.subtitle as string | undefined;
  const trustBadges = (content.trustBadges as string[] | undefined) ?? [];
  const buttonText = content.buttonText as string | undefined;
  const buttonUrl = content.buttonUrl as string | undefined;
  const secondaryButtonText = content.secondaryButtonText as string | undefined;
  const secondaryButtonUrl = content.secondaryButtonUrl as string | undefined;

  return (
    <section className="bg-gradient-to-br from-[var(--rt-brand-primary)] via-[color-mix(in_srgb,var(--rt-brand-primary),black_15%)] to-[color-mix(in_srgb,var(--rt-brand-primary),black_30%)] px-4 py-16 text-center sm:px-6 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-3xl font-bold leading-tight text-white md:text-4xl">
          <InlineText value={title} placeholder="Sarlavha (boshlanishi)" onCommit={(v) => onFieldChange("title", v)} />{" "}
          <InlineText
            value={highlight}
            placeholder="Ajratilgan qism"
            onCommit={(v) => onFieldChange("highlight", v)}
            className="rounded-md bg-[var(--rt-accent)]/15 px-1.5 text-[var(--rt-accent)]"
          />{" "}
          <InlineText value={titleEnd} placeholder="Sarlavha (davomi)" onCommit={(v) => onFieldChange("titleEnd", v)} />
        </h2>

        <InlineText
          value={subtitle}
          placeholder="Matn"
          multiline
          onCommit={(v) => onFieldChange("subtitle", v)}
          className="mx-auto mt-4 block max-w-xl text-white/70"
        />

        <ul className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
          <InlineChecklist items={trustBadges} onChange={(v) => onFieldChange("trustBadges", v)} />
        </ul>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-lg bg-[var(--rt-accent)] px-6 py-3 font-semibold text-[var(--rt-brand-primary)]">
            <InlineText value={buttonText} placeholder="Tugma matni" onCommit={(v) => onFieldChange("buttonText", v)} />
          </div>
          <InlineText
            value={buttonUrl}
            placeholder="/contact"
            onCommit={(v) => onFieldChange("buttonUrl", v)}
            className="rounded border border-white/30 bg-white/10 px-2 py-1 text-xs text-white/70"
          />
          <div className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/5 px-6 py-3 font-semibold text-white">
            <InlineText
              value={secondaryButtonText}
              placeholder="Ikkinchi tugma matni"
              onCommit={(v) => onFieldChange("secondaryButtonText", v)}
            />
          </div>
          <InlineText
            value={secondaryButtonUrl}
            placeholder="/contact"
            onCommit={(v) => onFieldChange("secondaryButtonUrl", v)}
            className="rounded border border-white/30 bg-white/10 px-2 py-1 text-xs text-white/70"
          />
        </div>
      </div>
    </section>
  );
}
