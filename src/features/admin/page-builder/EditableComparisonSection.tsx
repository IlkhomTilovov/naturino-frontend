import { InlineText } from "../../../components/admin/inline/InlineText";
import { InlineChecklist } from "../../../components/admin/inline/InlineChecklist";
import { bgVariantClasses } from "../../../lib/utils/sectionBgVariant";
import { useCertificateBadges } from "../../../lib/hooks/useCertificateBadges";
import type { PageSectionContent } from "../../../types/page";

export function EditableComparisonSection({
  content,
  onFieldChange,
}: {
  content: PageSectionContent;
  onFieldChange: (key: string, value: unknown) => void;
}) {
  const eyebrow = content.eyebrow as string | undefined;
  const title = content.title as string | undefined;
  const subtitle = content.subtitle as string | undefined;
  const leftLabel = content.leftLabel as string | undefined;
  const leftTitle = content.leftTitle as string | undefined;
  const leftItems = (content.leftItems as string[] | undefined) ?? [];
  const rightBadge = content.rightBadge as string | undefined;
  const rightLabel = content.rightLabel as string | undefined;
  const rightTitle = content.rightTitle as string | undefined;
  const rightItems = (content.rightItems as string[] | undefined) ?? [];
  const bg = bgVariantClasses(content.bgVariant as string | undefined, "dark");
  const d = bg.isDark;
  const trustBadges = useCertificateBadges();

  return (
    <section className={`overflow-hidden ${bg.section} px-4 py-20 sm:px-6 sm:py-28`}>
      <div className="mx-auto max-w-5xl text-center">
        <InlineText
          value={eyebrow}
          placeholder="Eyebrow matni"
          onCommit={(v) => onFieldChange("eyebrow", v)}
          className={`text-xs font-semibold uppercase tracking-[0.2em] ${bg.eyebrow}`}
        />

        <h2 className={`mx-auto mt-4 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl ${bg.heading}`}>
          <InlineText value={title} placeholder="Sarlavha" onCommit={(v) => onFieldChange("title", v)} />
        </h2>

        <InlineText
          value={subtitle}
          placeholder="Matn"
          multiline
          onCommit={(v) => onFieldChange("subtitle", v)}
          className={`mx-auto mt-5 block max-w-2xl text-base sm:text-lg ${bg.body}`}
        />

        <div className="mt-14 grid items-start gap-6 text-left sm:mt-16 lg:grid-cols-2 lg:gap-8">
          <div className={`order-2 rounded-2xl border p-7 lg:order-1 ${d ? "border-white/10 bg-white/[0.04]" : "border-black/5 bg-white"}`}>
            <InlineText
              value={leftLabel}
              placeholder="Chap ustun nomi"
              onCommit={(v) => onFieldChange("leftLabel", v)}
              className={`text-xs font-semibold uppercase tracking-wide ${d ? "text-white/40" : "text-taupe"}`}
            />
            <h3 className={`mt-2 text-xl font-semibold ${d ? "text-white/60" : "text-[#294A34]/70"}`}>
              <InlineText value={leftTitle} placeholder="Chap ustun sarlavhasi" onCommit={(v) => onFieldChange("leftTitle", v)} />
            </h3>
            <ul className="mt-6 space-y-3.5">
              <InlineChecklist items={leftItems} onChange={(v) => onFieldChange("leftItems", v)} />
            </ul>
          </div>

          <div
            className={`relative order-1 rounded-2xl border p-7 lg:order-2 lg:scale-[1.04] ${
              d
                ? "border-[var(--rt-accent)]/50 bg-[color-mix(in_srgb,var(--rt-brand-primary),black_15%)] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.45)]"
                : "border-[var(--rt-brand-primary)]/25 bg-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.12)]"
            }`}
          >
            <InlineText
              value={rightBadge}
              placeholder="O'ng ustun belgisi"
              onCommit={(v) => onFieldChange("rightBadge", v)}
              className="absolute -top-3 left-7 rounded-full bg-[var(--rt-accent)] px-3 py-1 text-xs font-semibold tracking-wide text-slate-900"
            />
            <InlineText
              value={rightLabel}
              placeholder="O'ng ustun nomi"
              onCommit={(v) => onFieldChange("rightLabel", v)}
              className={`mt-2 block text-xs font-semibold uppercase tracking-wide ${
                d ? "text-[var(--rt-accent)]" : "text-[var(--rt-brand-primary)]"
              }`}
            />
            <h3 className={`mt-2 text-xl font-semibold sm:text-2xl ${d ? "text-white" : "text-[#294A34]"}`}>
              <InlineText value={rightTitle} placeholder="O'ng ustun sarlavhasi" onCommit={(v) => onFieldChange("rightTitle", v)} />
            </h3>
            <ul className="relative z-10 mt-6 space-y-3.5">
              <InlineChecklist items={rightItems} onChange={(v) => onFieldChange("rightItems", v)} />
            </ul>
          </div>
        </div>

        <div className={`mt-12 flex flex-wrap items-center justify-center gap-3 border-t pt-10 sm:mt-14 ${d ? "border-white/10" : "border-black/10"}`}>
          {trustBadges.map((badge) => (
            <span
              key={badge}
              className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold ${
                d ? "border-white/15 bg-white/5 text-white/80" : "border-black/10 bg-black/[0.03] text-[#294A34]/80"
              }`}
            >
              <span className={d ? "text-[var(--rt-accent)]" : "text-[var(--rt-brand-primary)]"}>✓</span>
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
