import { Award, BadgeCheck, FileCheck2, ShieldCheck, Stamp, type LucideIcon } from "lucide-react";
import type { PageSectionContent } from "../../../../types/page";
import { useInView } from "../../../../lib/hooks/useInView";

interface Badge {
  icon?: string;
  title: string;
  description?: string;
}

const ICONS: Record<string, LucideIcon> = {
  shield: ShieldCheck,
  badge: BadgeCheck,
  award: Award,
  document: FileCheck2,
  seal: Stamp,
};

// A "wall" of certification badges — for pages that need to assert credibility
// through a row of standards/certificates rather than one hero certificate.
export function QualityBadgeWallSection({ content }: { content: PageSectionContent }) {
  const eyebrow = content.eyebrow as string | undefined;
  const title = content.title as string | undefined;
  const subtitle = content.subtitle as string | undefined;
  const badges = (content.badges as Badge[] | undefined) ?? [];
  const { ref, inView } = useInView<HTMLDivElement>();

  if (!title) return null;

  return (
    <section className="bg-white px-4 py-16 sm:px-6 sm:py-24">
      <div ref={ref} className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--rt-brand-secondary)]">{eyebrow}</p>
          )}
          <h2 className="mt-4 text-3xl font-bold leading-tight text-[#294A34] sm:text-4xl">{title}</h2>
          {subtitle && <p className="mx-auto mt-4 max-w-2xl text-base text-taupe sm:text-lg">{subtitle}</p>}
        </div>

        {badges.length > 0 && (
          <div className="mt-12 flex flex-wrap items-stretch justify-center gap-4">
            {badges.map((b, i) => {
              const Icon = ICONS[b.icon ?? ""] ?? ShieldCheck;
              return (
                <div
                  key={i}
                  style={{ transitionDelay: inView ? `${i * 90}ms` : "0ms" }}
                  className={`flex w-40 flex-col items-center gap-2 rounded-2xl border border-herb/50 bg-[#F3EDE1]/40 px-4 py-6 text-center transition-all duration-700 hover:-translate-y-1 hover:shadow-md sm:w-44 ${
                    inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  }`}
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[var(--rt-brand-secondary)]/30 text-[var(--rt-brand-secondary)]">
                    <Icon className="h-7 w-7" strokeWidth={1.6} />
                  </span>
                  <p className="mt-1 text-sm font-semibold text-[#294A34]">{b.title}</p>
                  {b.description && <p className="text-xs text-taupe">{b.description}</p>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
