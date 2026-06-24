import type { PageSectionContent } from "../../../../types/page";
import { useInView } from "../../../../lib/hooks/useInView";

const TRUST_BADGES = ["ISO 22000", "HACCP", "GMP+", "EAC", "Veterinariya tasdig'i"];

export function ComparisonSection({ content }: { content: PageSectionContent }) {
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
  const { ref, inView } = useInView<HTMLDivElement>();

  if (!title) return null;

  return (
    <section className="overflow-hidden bg-[color-mix(in_srgb,var(--rt-brand-primary),black_30%)] px-4 py-20 text-white sm:px-6 sm:py-28">
      <div ref={ref} className="mx-auto max-w-5xl text-center">
        {eyebrow && (
          <p
            className={`flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--rt-accent)] transition-all duration-700 ${
              inView ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            }`}
          >
            ✦ {eyebrow}
          </p>
        )}

        <h2
          style={{ transitionDelay: inView ? "100ms" : "0ms" }}
          className={`mx-auto mt-4 max-w-3xl text-3xl font-bold leading-tight transition-all duration-700 sm:text-4xl lg:text-5xl ${
            inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          {title}
        </h2>

        {subtitle && (
          <p
            style={{ transitionDelay: inView ? "200ms" : "0ms" }}
            className={`mx-auto mt-5 max-w-2xl text-base text-white/65 transition-all duration-700 sm:text-lg ${
              inView ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
          >
            {subtitle}
          </p>
        )}

        <div className="mt-14 grid items-center gap-6 text-left sm:mt-16 lg:grid-cols-2 lg:gap-8">
          <div
            style={{ transitionDelay: inView ? "320ms" : "0ms" }}
            className={`order-2 rounded-2xl border border-white/10 bg-white/[0.04] p-7 transition-all duration-700 lg:order-1 ${
              inView ? "translate-x-0 opacity-100" : "-translate-x-6 opacity-0"
            }`}
          >
            {leftLabel && <p className="text-xs font-semibold uppercase tracking-wide text-white/40">{leftLabel}</p>}
            {leftTitle && <h3 className="mt-2 text-xl font-semibold text-white/60">{leftTitle}</h3>}
            <ul className="mt-6 space-y-3.5">
              {leftItems.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-white/45">
                  <span className="mt-0.5 text-white/30">✕</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div
            style={{
              transitionDelay: inView ? "440ms" : "0ms",
              backgroundImage:
                "radial-gradient(circle at 85% 0%, color-mix(in srgb, var(--rt-brand-secondary) 16%, transparent) 0%, transparent 55%), radial-gradient(circle at 0% 100%, color-mix(in srgb, var(--rt-accent) 10%, transparent) 0%, transparent 50%)",
            }}
            className={`relative order-1 rounded-2xl border border-[var(--rt-accent)]/50 bg-[color-mix(in_srgb,var(--rt-brand-primary),black_15%)] p-7 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.45)] transition-all duration-700 lg:order-2 lg:scale-[1.04] ${
              inView ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"
            }`}
          >
            {rightBadge && (
              <span className="absolute -top-3 left-7 rounded-full bg-[var(--rt-accent)] px-3 py-1 text-xs font-semibold tracking-wide text-slate-900">
                {rightBadge}
              </span>
            )}
            {rightLabel && (
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-[var(--rt-accent)]">{rightLabel}</p>
            )}
            {rightTitle && <h3 className="mt-2 text-xl font-semibold text-white sm:text-2xl">{rightTitle}</h3>}
            <ul className="relative z-10 mt-6 space-y-3.5">
              {rightItems.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-white/90">
                  <span className="mt-0.5 text-[var(--rt-accent)]">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          style={{ transitionDelay: inView ? "640ms" : "0ms" }}
          className={`mt-12 flex flex-wrap items-center justify-center gap-3 border-t border-white/10 pt-10 transition-all duration-700 sm:mt-14 ${
            inView ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
        >
          {TRUST_BADGES.map((badge) => (
            <span
              key={badge}
              className="group flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80 shadow-sm transition-all duration-300 hover:border-[var(--rt-accent)] hover:bg-[var(--rt-accent)] hover:text-slate-900"
            >
              <span className="text-[var(--rt-accent)] group-hover:text-slate-900">✓</span>
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
