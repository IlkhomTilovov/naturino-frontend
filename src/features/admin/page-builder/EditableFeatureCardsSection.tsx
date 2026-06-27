import { InlineText } from "../../../components/admin/inline/InlineText";
import { InlineImage } from "../../../components/admin/inline/InlineImage";
import { InlineIconCardGrid } from "../../../components/admin/inline/InlineIconCardGrid";
import type { PageSectionContent } from "../../../types/page";

interface FeatureCard {
  icon?: string;
  title?: string;
  description?: string;
}

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
  const variant = (content.variant as string | undefined) ?? (imageUrl ? "image" : "plain");
  const isDark = variant === "dark";
  const showImage = variant === "image";

  return (
    <section className={`overflow-hidden px-4 py-16 sm:px-6 sm:py-24 ${isDark ? "bg-[var(--rt-brand-primary)]" : "bg-[#F8F9F4]"}`}>
      <div className={showImage ? "mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16" : "mx-auto max-w-6xl"}>
        <div className={showImage ? "order-2 lg:order-1" : undefined}>
          <InlineText
            value={eyebrow}
            placeholder="Eyebrow matni"
            onCommit={(v) => onFieldChange("eyebrow", v)}
            className={`text-xs font-semibold uppercase tracking-[0.2em] ${isDark ? "text-white/70" : "text-[var(--rt-brand-secondary)]"}`}
          />
          <h2
            className={`mt-4 max-w-xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl ${isDark ? "text-white" : "text-[#0F172A]"} ${
              showImage ? "" : "mx-auto text-center"
            }`}
          >
            <InlineText value={title} placeholder="Sarlavha" onCommit={(v) => onFieldChange("title", v)} />
          </h2>
          <InlineText
            value={subtitle}
            placeholder="Matn"
            multiline
            onCommit={(v) => onFieldChange("subtitle", v)}
            className={`mt-5 block max-w-[600px] text-lg ${isDark ? "text-white/70" : "text-slate-600"} ${showImage ? "" : "mx-auto text-center"}`}
          />

          <InlineIconCardGrid
            cards={cards}
            onChange={(v) => onFieldChange("cards", v)}
            gridClassName={`mt-10 grid gap-5 ${showImage ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}
          />
        </div>

        {showImage && (
          <div className="order-1 lg:order-2">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-2xl sm:aspect-square lg:aspect-[4/5]">
              <InlineImage imageUrl={imageUrl} alt={title} className="h-full w-full object-cover" onChange={(url) => onFieldChange("imageUrl", url)} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
