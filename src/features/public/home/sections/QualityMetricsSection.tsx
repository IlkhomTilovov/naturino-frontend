import { Cat, Dog, type LucideIcon } from "lucide-react";
import type { PageSectionContent } from "../../../../types/page";
import { useInView } from "../../../../lib/hooks/useInView";
import { bgVariantClasses } from "../../../../lib/utils/sectionBgVariant";

interface Metric {
  value: string;
  label: string;
}

const TITLE_ICONS: Record<string, LucideIcon> = { dog: Dog, cat: Cat };

// Metrics band for quality proof points that read best as bold numbers
// (purity %, defect rate, inspection count) rather than icons. Supports a
// species titleIcon + warmer badge tone so an "It formulasi" and "Mushuk
// formulasi" variant of this section read as visually distinct twins
// rather than identical blocks with only the copy swapped.
export function QualityMetricsSection({ content }: { content: PageSectionContent }) {
  const eyebrow = content.eyebrow as string | undefined;
  const title = content.title as string | undefined;
  const subtitle = content.subtitle as string | undefined;
  const metrics = (content.metrics as Metric[] | undefined) ?? [];
  const titleIcon = content.titleIcon as string | undefined;
  const badgeTone = content.badgeTone as string | undefined;
  const columns = content.columns as string | undefined;
  const { ref, inView } = useInView<HTMLDivElement>();
  const bg = bgVariantClasses(content.bgVariant as string | undefined, "bg-[var(--rt-brand-primary)]");

  if (!title) return null;

  const TitleIcon = TITLE_ICONS[titleIcon ?? ""];
  const isWarm = badgeTone === "warm";
  const gridColsClass = columns === "3" ? "sm:grid-cols-3" : "sm:grid-cols-5";

  return (
    <section className={`${bg.section} px-4 py-20 sm:px-6 sm:py-24`}>
      <div ref={ref} className="mx-auto max-w-5xl text-center">
        {eyebrow && (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
              isWarm
                ? bg.isDark
                  ? "bg-white/10 text-[#E8C9A0]"
                  : "bg-[#9F8A6C]/15 text-[#9F8A6C]"
                : bg.eyebrow
            }`}
          >
            {eyebrow}
          </span>
        )}
        <h2 className={`mt-4 flex items-center justify-center gap-2.5 text-3xl font-bold leading-tight sm:text-4xl ${bg.heading}`}>
          {TitleIcon && <TitleIcon className="h-7 w-7 shrink-0" strokeWidth={1.75} aria-hidden />}
          {title}
        </h2>
        {subtitle && <p className={`mx-auto mt-4 max-w-2xl text-base sm:text-lg ${bg.body}`}>{subtitle}</p>}

        {metrics.length > 0 && (
          <div className={`mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-3 ${gridColsClass}`}>
            {metrics.map((m, i) => (
              <div
                key={i}
                style={{ transitionDelay: inView ? `${i * 100}ms` : "0ms" }}
                className={`rounded-xl border px-5 py-4 transition-all duration-700 ${bg.card} ${
                  inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
              >
                <p className={`text-4xl font-extrabold sm:text-5xl ${bg.isDark ? "text-[var(--rt-accent)]" : "text-[#294A34]"}`}>
                  {m.value}
                </p>
                <p className={`mt-2 text-sm ${bg.cardLabel}`}>{m.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
