import { Link } from "react-router-dom";
import type { PageSectionContent } from "../../../../types/page";
import { useInView } from "../../../../lib/hooks/useInView";
import { bgVariantClasses } from "../../../../lib/utils/sectionBgVariant";

const DEFAULT_TRUST_BADGES = ["ISO 22000", "HACCP", "20+ eksport bozori", "12 000+ tonna/yil"];

export function CtaSection({ content }: { content: PageSectionContent }) {
  const title = content.title as string | undefined;
  const highlight = content.highlight as string | undefined;
  const titleEnd = content.titleEnd as string | undefined;
  const subtitle = content.subtitle as string | undefined;
  const trustBadges = (content.trustBadges as string[] | undefined) ?? DEFAULT_TRUST_BADGES;
  const buttonText = content.buttonText as string | undefined;
  const buttonUrl = (content.buttonUrl as string | undefined) ?? "/contact";
  const secondaryButtonText = content.secondaryButtonText as string | undefined;
  const secondaryButtonUrl = (content.secondaryButtonUrl as string | undefined) ?? "/contact";
  const { ref, inView } = useInView<HTMLDivElement>();
  const bg = bgVariantClasses(content.bgVariant as string | undefined, "bg-[var(--rt-brand-primary)]");
  const d = bg.isDark;

  if (!title) return null;

  return (
    <section className={`${bg.section} px-4 py-20 text-center sm:px-6 sm:py-20`}>
      <div ref={ref} className="mx-auto max-w-3xl">
        <h2
          className={`text-3xl font-bold leading-tight transition-all duration-700 md:text-4xl ${bg.heading} ${
            inView ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
        >
          {title}
          {highlight && (
            <span className="rounded-md bg-[var(--rt-accent)]/15 px-1.5 text-[var(--rt-accent)]">{highlight}</span>
          )}
          {titleEnd}
        </h2>

        {subtitle && (
          <p
            style={{ transitionDelay: inView ? "120ms" : "0ms" }}
            className={`mx-auto mt-4 max-w-xl transition-all duration-700 ${bg.body} ${
              inView ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            }`}
          >
            {subtitle}
          </p>
        )}

        {trustBadges.length > 0 && (
          <div
            style={{ transitionDelay: inView ? "240ms" : "0ms" }}
            className={`mt-6 flex flex-wrap items-center justify-center gap-2.5 transition-all duration-700 ${
              inView ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            }`}
          >
            {trustBadges.map((badge) => (
              <span
                key={badge}
                className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold ${
                  d ? "border-white/15 bg-white/5 text-white/80" : "border-black/10 bg-black/[0.03] text-[#294A34]/80"
                }`}
              >
                <span className={d ? "text-[var(--rt-accent)]" : "text-[var(--rt-brand-primary)]"}>✓</span>
                {badge}
              </span>
            ))}
          </div>
        )}

        {(buttonText || secondaryButtonText) && (
          <div
            style={{ transitionDelay: inView ? "360ms" : "0ms" }}
            className={`mt-8 flex flex-wrap items-center justify-center gap-3 transition-all duration-700 ${
              inView ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            }`}
          >
            {buttonText && (
              <Link
                to={buttonUrl}
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--rt-accent)] px-6 py-3 font-semibold text-[var(--rt-brand-primary)] shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_15px_35px_-10px_rgba(232,162,58,0.5)]"
              >
                {buttonText} <span aria-hidden>→</span>
              </Link>
            )}
            {secondaryButtonText && (
              <Link
                to={secondaryButtonUrl}
                className={`inline-flex items-center gap-2 rounded-lg border px-6 py-3 font-semibold transition-all duration-300 hover:-translate-y-0.5 ${
                  d
                    ? "border-white/25 bg-white/5 text-white hover:border-white/40 hover:bg-white/10"
                    : "border-black/15 bg-black/[0.03] text-[#294A34] hover:border-[#294A34]/40 hover:bg-black/[0.06]"
                }`}
              >
                {secondaryButtonText} <span aria-hidden>→</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
