import { Cat, Dog, type LucideIcon } from "lucide-react";
import { InlineText } from "../../../components/admin/inline/InlineText";
import { InlineStatList } from "../../../components/admin/inline/InlineStatList";
import { bgVariantClasses } from "../../../lib/utils/sectionBgVariant";
import type { PageSectionContent } from "../../../types/page";

const TITLE_ICONS: Record<string, LucideIcon> = { dog: Dog, cat: Cat };

export function EditableQualityMetricsSection({
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
  const titleIcon = content.titleIcon as string | undefined;
  const badgeTone = content.badgeTone as string | undefined;
  const columns = content.columns as string | undefined;
  const bg = bgVariantClasses(content.bgVariant as string | undefined, "bg-[var(--rt-brand-primary)]");

  const TitleIcon = TITLE_ICONS[titleIcon ?? ""];
  const isWarm = badgeTone === "warm";
  const gridColsClass = columns === "3" ? "sm:grid-cols-3" : "sm:grid-cols-5";
  const eyebrowClass = isWarm
    ? bg.isDark
      ? "bg-white/10 text-[#E8C9A0]"
      : "bg-[#9F8A6C]/15 text-[#9F8A6C]"
    : bg.eyebrow;

  return (
    <section className={`${bg.section} px-4 py-20 sm:px-6 sm:py-24`}>
      <div className="mx-auto max-w-5xl text-center">
        <InlineText
          value={eyebrow}
          placeholder="Eyebrow matni"
          onCommit={(v) => onFieldChange("eyebrow", v)}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${eyebrowClass}`}
        />
        <h2 className={`mt-4 flex items-center justify-center gap-2.5 text-3xl font-bold leading-tight sm:text-4xl ${bg.heading}`}>
          {TitleIcon && <TitleIcon className="h-7 w-7 shrink-0" strokeWidth={1.75} aria-hidden />}
          <InlineText value={title} placeholder="Sarlavha" onCommit={(v) => onFieldChange("title", v)} />
        </h2>
        <InlineText
          value={subtitle}
          placeholder="Tasvir matni"
          multiline
          onCommit={(v) => onFieldChange("subtitle", v)}
          className={`mx-auto mt-4 block max-w-2xl text-base sm:text-lg ${bg.body}`}
        />

        <div className={`mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-3 ${gridColsClass}`}>
          <InlineStatList
            items={metrics}
            onChange={(v) => onFieldChange("metrics", v)}
            itemClassName={`rounded-xl border px-5 py-4 ${bg.card}`}
            valueClassName={`block text-4xl font-extrabold sm:text-5xl ${bg.isDark ? "text-[var(--rt-accent)]" : "text-[#294A34]"}`}
            labelClassName={`mt-2 block text-sm ${bg.cardLabel}`}
            addButtonClassName={`col-span-2 flex items-center justify-center gap-1 rounded-md border border-dashed px-2 py-1.5 text-xs font-medium transition-colors sm:col-span-5 ${
              bg.isDark
                ? "border-white/40 text-white/70 hover:border-white hover:text-white"
                : "border-black/20 text-taupe hover:border-[#294A34] hover:text-[#294A34]"
            }`}
          />
        </div>
      </div>
    </section>
  );
}
