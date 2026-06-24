import type { PageSectionContent } from "../../../../types/page";
import { useInView } from "../../../../lib/hooks/useInView";

export function TrustBarSection({ content }: { content: PageSectionContent }) {
  const eyebrow = content.eyebrow as string | undefined;
  const badges = (content.badges as string[] | undefined) ?? [];
  const highlight = content.highlight as string | undefined;
  const { ref, inView } = useInView<HTMLDivElement>();

  if (badges.length === 0 && !highlight) return null;

  const pills = highlight ? [...badges, highlight] : badges;

  return (
    <section className="border-y border-[#E7EBDD] bg-[#F8F9F4] py-12 sm:py-16">
      <div ref={ref} className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 text-center">
        {eyebrow && (
          <p
            className={`text-xs font-semibold uppercase tracking-[0.2em] text-[var(--rt-brand-secondary)] transition-all duration-700 ${
              inView ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
          >
            {eyebrow}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {pills.map((badge, i) => (
            <span
              key={badge}
              style={{ transitionDelay: inView ? `${120 + i * 80}ms` : "0ms" }}
              className={`group flex items-center gap-2 rounded-full border border-[var(--rt-brand-primary)]/20 bg-white px-5 py-3 text-sm font-semibold text-[#0F172A] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--rt-brand-primary)] hover:bg-[var(--rt-brand-primary)] hover:text-white hover:shadow-md ${
                inView ? "translate-y-0 scale-100 opacity-100" : "translate-y-3 scale-95 opacity-0"
              }`}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--rt-brand-secondary)]/15 text-xs text-[var(--rt-brand-primary)] transition-colors duration-300 group-hover:bg-white/20 group-hover:text-white">
                ✓
              </span>
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
