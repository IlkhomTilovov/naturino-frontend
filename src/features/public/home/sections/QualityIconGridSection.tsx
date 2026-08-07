import { Award, BadgeCheck, Beaker, Leaf, ShieldCheck, Sparkles, type LucideIcon } from "lucide-react";
import type { PageSectionContent } from "../../../../types/page";
import { useInView } from "../../../../lib/hooks/useInView";
import { bgVariantClasses } from "../../../../lib/utils/sectionBgVariant";

interface QualityItem {
  icon?: string;
  title: string;
  description?: string;
}

const ICONS: Record<string, LucideIcon> = {
  shield: ShieldCheck,
  badge: BadgeCheck,
  award: Award,
  leaf: Leaf,
  beaker: Beaker,
  sparkles: Sparkles,
};

// Grid of quality pillars — for pages that need to list several independent
// quality principles side by side rather than one long paragraph.
export function QualityIconGridSection({ content }: { content: PageSectionContent }) {
  const eyebrow = content.eyebrow as string | undefined;
  const title = content.title as string | undefined;
  const subtitle = content.subtitle as string | undefined;
  const items = (content.items as QualityItem[] | undefined) ?? [];
  const { ref, inView } = useInView<HTMLDivElement>();
  const bg = bgVariantClasses(content.bgVariant as string | undefined, "bg-white");

  if (!title) return null;

  return (
    <section className={`${bg.section} px-4 py-20 sm:px-6 sm:py-24`}>
      <div ref={ref} className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          {eyebrow && <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${bg.eyebrow}`}>{eyebrow}</p>}
          <h2 className={`mt-4 text-3xl font-bold leading-tight sm:text-4xl ${bg.heading}`}>{title}</h2>
          {subtitle && <p className={`mx-auto mt-4 max-w-2xl text-base sm:text-lg ${bg.body}`}>{subtitle}</p>}
        </div>

        {items.length > 0 && (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, i) => {
              const Icon = ICONS[item.icon ?? ""] ?? ShieldCheck;
              return (
                <div
                  key={i}
                  style={{ transitionDelay: inView ? `${i * 100}ms` : "0ms" }}
                  className={`rounded-2xl border p-6 transition-all duration-700 hover:-translate-y-1 hover:shadow-md ${bg.card} ${
                    inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  }`}
                >
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                      bg.isDark ? "bg-white/10 text-[var(--rt-accent)]" : "bg-[var(--rt-brand-primary)]/10 text-[var(--rt-brand-primary)]"
                    }`}
                  >
                    <Icon className="h-6 w-6" strokeWidth={1.75} />
                  </span>
                  <h3 className={`mt-4 font-semibold ${bg.heading}`}>{item.title}</h3>
                  {item.description && <p className={`mt-1.5 text-sm ${bg.body}`}>{item.description}</p>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
