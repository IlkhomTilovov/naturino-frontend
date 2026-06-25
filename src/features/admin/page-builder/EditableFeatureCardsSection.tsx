import { InlineText } from "../../../components/admin/inline/InlineText";
import { InlineImage } from "../../../components/admin/inline/InlineImage";
import { InlineIconCardGrid } from "../../../components/admin/inline/InlineIconCardGrid";
import type { PageSectionContent } from "../../../types/page";

interface FeatureCard {
  icon?: string;
  title?: string;
  description?: string;
}

const TRUST_BADGES = ["ISO 22000", "HACCP", "GMP+", "EAC", "Veterinariya tasdig'i"];

export function EditableFeatureCardsSection({
  content,
  onFieldChange,
}: {
  content: PageSectionContent;
  onFieldChange: (key: string, value: unknown) => void;
}) {
  const eyebrow = content.eyebrow as string | undefined;
  const title = content.title as string | undefined;
  const subtitle = content.subtitle as string | undefined;
  const cards = (content.cards as FeatureCard[] | undefined) ?? [];
  const imageUrl = content.imageUrl as string | undefined;

  return (
    <section className="overflow-hidden bg-[#F8F9F4] px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="order-2 lg:order-1">
          <InlineText
            value={eyebrow}
            placeholder="Eyebrow matni"
            onCommit={(v) => onFieldChange("eyebrow", v)}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--rt-brand-secondary)]"
          />
          <h2 className="mt-4 max-w-xl text-3xl font-bold leading-tight text-[#0F172A] sm:text-4xl lg:text-5xl">
            <InlineText value={title} placeholder="Sarlavha" onCommit={(v) => onFieldChange("title", v)} />
          </h2>
          <InlineText
            value={subtitle}
            placeholder="Matn"
            multiline
            onCommit={(v) => onFieldChange("subtitle", v)}
            className="mt-5 block max-w-[600px] text-lg text-slate-600"
          />

          <InlineIconCardGrid cards={cards} onChange={(v) => onFieldChange("cards", v)} gridClassName="mt-10 grid gap-5 sm:grid-cols-2" />

          <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-[#E7EBDD] pt-8">
            {TRUST_BADGES.map((badge) => (
              <span key={badge} className="flex items-center gap-1.5 rounded-full border border-[var(--rt-brand-secondary)]/20 bg-white px-4 py-2 text-xs font-semibold text-[#0F172A]">
                <span className="text-[var(--rt-brand-secondary)]">✓</span>
                {badge}
              </span>
            ))}
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-2xl sm:aspect-square lg:aspect-[4/5]">
            <InlineImage imageUrl={imageUrl} alt={title} className="h-full w-full object-cover" onChange={(url) => onFieldChange("imageUrl", url)} />
          </div>
        </div>
      </div>
    </section>
  );
}
