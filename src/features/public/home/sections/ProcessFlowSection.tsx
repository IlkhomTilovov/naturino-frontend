import { ArrowRight, FileCheck2, Globe2, PackageCheck, ShieldCheck, Truck, type LucideIcon } from "lucide-react";
import type { PageSectionContent } from "../../../../types/page";
import { useInView } from "../../../../lib/hooks/useInView";

interface Step {
  icon?: string;
  title: string;
}

const ICONS: Record<string, LucideIcon> = {
  inquiry: Globe2,
  agreement: FileCheck2,
  quality: ShieldCheck,
  packaging: PackageCheck,
  shipping: Truck,
};

// A compact, single-row icon flow (A → B → C → D) — for a short process
// summary that belongs near the top of a page rather than a full narrative.
export function ProcessFlowSection({ content }: { content: PageSectionContent }) {
  const eyebrow = content.eyebrow as string | undefined;
  const title = content.title as string | undefined;
  const subtitle = content.subtitle as string | undefined;
  const steps = (content.steps as Step[] | undefined) ?? [];
  const { ref, inView } = useInView<HTMLDivElement>();

  if (!title) return null;

  return (
    <section className="bg-sand-50 px-4 py-16 text-center sm:px-6 sm:py-20">
      <div ref={ref} className="mx-auto max-w-5xl">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--rt-brand-primary)]">{eyebrow}</p>
        )}
        <h2 className="mt-4 text-3xl font-bold leading-tight text-[#294A34] sm:text-4xl">{title}</h2>
        {subtitle && <p className="mx-auto mt-4 max-w-2xl text-base text-taupe sm:text-lg">{subtitle}</p>}

        {steps.length > 0 && (
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3 sm:flex-nowrap sm:gap-2">
            {steps.map((step, i) => {
              const Icon = ICONS[step.icon ?? ""] ?? Globe2;
              return (
                <div key={i} className="flex items-center gap-2 sm:gap-3">
                  <div
                    style={{ transitionDelay: inView ? `${i * 120}ms` : "0ms" }}
                    className={`flex flex-col items-center gap-2 transition-all duration-700 ${
                      inView ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                    }`}
                  >
                    <span className="flex h-16 w-16 items-center justify-center rounded-full border border-herb/50 bg-white text-[var(--rt-brand-primary)] shadow-sm">
                      <Icon className="h-7 w-7" strokeWidth={1.6} />
                    </span>
                    <p className="max-w-[6.5rem] text-xs font-semibold text-[#294A34]">{step.title}</p>
                  </div>
                  {i < steps.length - 1 && <ArrowRight className="h-5 w-5 shrink-0 text-herb" strokeWidth={1.8} />}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
