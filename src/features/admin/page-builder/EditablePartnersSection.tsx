import { InlineText } from "../../../components/admin/inline/InlineText";
import { InlineIconCardGrid } from "../../../components/admin/inline/InlineIconCardGrid";
import type { PageSectionContent } from "../../../types/page";

interface TrustCard {
  icon?: string;
  title?: string;
  description?: string;
}

export function EditablePartnersSection({
  content,
  onFieldChange,
}: {
  content: PageSectionContent;
  onFieldChange: (key: string, value: unknown) => void;
}) {
  const eyebrow = content.eyebrow as string | undefined;
  const title = content.title as string | undefined;
  const subtitle = content.subtitle as string | undefined;
  const cards = (content.cards as TrustCard[] | undefined) ?? [];

  return (
    <section className="bg-[#F8F9F4] px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl text-center">
        <InlineText
          value={eyebrow}
          placeholder="Eyebrow matni"
          onCommit={(v) => onFieldChange("eyebrow", v)}
          className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--rt-brand-primary)]"
        />
        <h2 className="mt-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
          <InlineText value={title} placeholder="Sarlavha" onCommit={(v) => onFieldChange("title", v)} />
        </h2>
        <InlineText
          value={subtitle}
          placeholder="Matn"
          multiline
          onCommit={(v) => onFieldChange("subtitle", v)}
          className="mx-auto mt-4 block max-w-2xl text-base text-slate-500"
        />

        <InlineIconCardGrid
          cards={cards}
          onChange={(v) => onFieldChange("cards", v)}
          iconHint="globe/factory/shield/package"
          gridClassName="mt-12 grid gap-6 text-left sm:grid-cols-2 lg:grid-cols-4"
        />
      </div>
    </section>
  );
}
