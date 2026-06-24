import { Factory, Globe2, type LucideIcon, Package, ShieldCheck } from "lucide-react";
import type { PageSectionContent } from "../../../../types/page";
import { useInView } from "../../../../lib/hooks/useInView";

interface TrustCard {
  icon?: string;
  title: string;
  description: string;
}

const ICONS: Record<string, LucideIcon> = {
  globe: Globe2,
  factory: Factory,
  shield: ShieldCheck,
  package: Package,
};

export function PartnersSection({ content }: { content: PageSectionContent }) {
  const eyebrow = content.eyebrow as string | undefined;
  const title = content.title as string | undefined;
  const subtitle = content.subtitle as string | undefined;
  const cards = (content.cards as TrustCard[] | undefined) ?? [];
  const { ref, inView } = useInView<HTMLDivElement>();

  if (!title) return null;

  return (
    <section className="bg-[#F8F9F4] px-4 py-16 sm:px-6 sm:py-24">
      <div ref={ref} className="mx-auto max-w-6xl text-center">
        {eyebrow && (
          <p
            className={`text-xs font-semibold uppercase tracking-[0.2em] text-[var(--rt-brand-primary)] transition-all duration-700 ${
              inView ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            }`}
          >
            {eyebrow}
          </p>
        )}
        <h2
          style={{ transitionDelay: inView ? "80ms" : "0ms" }}
          className={`mt-4 text-3xl font-bold leading-tight text-slate-900 transition-all duration-700 sm:text-4xl ${
            inView ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            style={{ transitionDelay: inView ? "160ms" : "0ms" }}
            className={`mx-auto mt-4 max-w-2xl text-base text-slate-500 transition-all duration-700 ${
              inView ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            }`}
          >
            {subtitle}
          </p>
        )}

        {cards.length > 0 && (
          <div className="mt-12 grid gap-6 text-left sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card, i) => {
              const Icon = ICONS[card.icon ?? ""] ?? Globe2;
              return (
                <div
                  key={card.title}
                  style={{ transitionDelay: inView ? `${i * 100}ms` : "0ms" }}
                  className={`group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--rt-accent)] hover:shadow-[0_18px_40px_-15px_rgba(77,124,47,0.25)] ${
                    inView ? "translate-y-0 opacity-100 duration-700" : "translate-y-4 opacity-0 duration-700"
                  }`}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--rt-brand-primary)]/10 text-[var(--rt-brand-primary)] transition-colors duration-300 group-hover:bg-[var(--rt-accent)]/10 group-hover:text-[var(--rt-accent)]">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <h3 className="mt-4 font-semibold text-slate-900">{card.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{card.description}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
