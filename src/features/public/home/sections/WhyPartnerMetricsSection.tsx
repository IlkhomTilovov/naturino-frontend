import type { PageSectionContent } from "../../../../types/page";
import { useInView } from "../../../../lib/hooks/useInView";

interface Metric {
  value: string;
  label: string;
}

// Proof-by-numbers band (partner count, markets, years) — for closing an
// argument with hard figures rather than benefit copy.
export function WhyPartnerMetricsSection({ content }: { content: PageSectionContent }) {
  const eyebrow = content.eyebrow as string | undefined;
  const title = content.title as string | undefined;
  const subtitle = content.subtitle as string | undefined;
  const metrics = (content.metrics as Metric[] | undefined) ?? [];
  const { ref, inView } = useInView<HTMLDivElement>();

  if (!title) return null;

  return (
    <section className="bg-[#294A34] px-4 py-16 sm:px-6 sm:py-24">
      <div ref={ref} className="mx-auto max-w-5xl text-center">
        {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--rt-accent)]">{eyebrow}</p>}
        <h2 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl">{title}</h2>
        {subtitle && <p className="mx-auto mt-4 max-w-2xl text-base text-white/70 sm:text-lg">{subtitle}</p>}

        {metrics.length > 0 && (
          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-8 sm:grid-cols-4">
            {metrics.map((m, i) => (
              <div
                key={i}
                style={{ transitionDelay: inView ? `${i * 100}ms` : "0ms" }}
                className={`border-l-2 border-[var(--rt-accent)]/40 pl-4 text-left transition-all duration-700 ${
                  inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
              >
                <p className="text-4xl font-extrabold text-white sm:text-5xl">{m.value}</p>
                <p className="mt-2 text-sm text-white/60">{m.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
