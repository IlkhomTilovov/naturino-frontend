import { Globe2, Handshake, PackageCheck, ShieldCheck, TrendingUp, Truck, type LucideIcon } from "lucide-react";
import type { PageSectionContent } from "../../../../types/page";
import { useInView } from "../../../../lib/hooks/useInView";

interface Benefit {
  icon?: string;
  title: string;
  description?: string;
}

const ICONS: Record<string, LucideIcon> = {
  handshake: Handshake,
  globe: Globe2,
  shield: ShieldCheck,
  truck: Truck,
  package: PackageCheck,
  trending: TrendingUp,
};

// Four-column benefit grid — the densest of the WhyPartner variants, for
// pages that want to list many partnership benefits at a glance.
export function WhyPartnerIconGridSection({ content }: { content: PageSectionContent }) {
  const eyebrow = content.eyebrow as string | undefined;
  const title = content.title as string | undefined;
  const subtitle = content.subtitle as string | undefined;
  const items = (content.items as Benefit[] | undefined) ?? [];
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

        {items.length > 0 && (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item, i) => {
              const Icon = ICONS[item.icon ?? ""] ?? Handshake;
              return (
                <div
                  key={i}
                  style={{ transitionDelay: inView ? `${i * 100}ms` : "0ms" }}
                  className={`text-center transition-all duration-700 ${
                    inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  }`}
                >
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--rt-brand-primary)]/10 text-[var(--rt-brand-primary)]">
                    <Icon className="h-7 w-7" strokeWidth={1.6} />
                  </span>
                  <h3 className="mt-4 font-semibold text-[#294A34]">{item.title}</h3>
                  {item.description && <p className="mt-1.5 text-sm text-taupe">{item.description}</p>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
