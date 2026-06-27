import { FileCheck2, Factory, FlaskConical, Globe2, Handshake, type LucideIcon, Microscope, PackageCheck, ShieldCheck, Truck, Wheat } from "lucide-react";
import { Link } from "react-router-dom";
import type { PageSectionContent } from "../../../../types/page";
import { useInView } from "../../../../lib/hooks/useInView";

interface Step {
  number: string;
  title: string;
  description: string;
  icon?: string;
}

const ICONS: Record<string, LucideIcon> = {
  inquiry: Globe2,
  agreement: FileCheck2,
  export: PackageCheck,
  wheat: Wheat,
  formula: FlaskConical,
  factory: Factory,
  quality: ShieldCheck,
  packaging: PackageCheck,
  shipping: Truck,
  lab: Microscope,
  partnership: Handshake,
};

const DEFAULT_ICON_BY_INDEX: LucideIcon[] = [Globe2, FileCheck2, PackageCheck];

function chunk<T>(arr: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < arr.length; i += size) rows.push(arr.slice(i, i + size));
  return rows;
}

export function ProcessSection({ content }: { content: PageSectionContent }) {
  const eyebrow = content.eyebrow as string | undefined;
  const title = content.title as string | undefined;
  const subtitle = content.subtitle as string | undefined;
  const steps = (content.steps as Step[] | undefined) ?? [];
  const buttonText = content.buttonText as string | undefined;
  const buttonUrl = (content.buttonUrl as string | undefined) ?? "/contact";
  const ctaTitle = content.ctaTitle as string | undefined;
  const ctaSubtitle = content.ctaSubtitle as string | undefined;
  const { ref, inView } = useInView<HTMLDivElement>();

  if (!title) return null;

  return (
    <section className="px-4 py-20 text-center sm:px-6 sm:py-28">
      <div ref={ref} className="mx-auto max-w-4xl">
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
          className={`mt-4 text-3xl font-bold leading-tight text-slate-900 transition-all duration-700 sm:text-4xl lg:text-5xl ${
            inView ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            style={{ transitionDelay: inView ? "160ms" : "0ms" }}
            className={`mx-auto mt-4 max-w-2xl text-base text-slate-500 transition-all duration-700 sm:text-lg ${
              inView ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            }`}
          >
            {subtitle}
          </p>
        )}

        {steps.length > 0 && (
          <div className="mt-10 space-y-8 sm:mt-12">
            {chunk(steps, 3).map((row, rowIndex) => (
              <div key={rowIndex} className="relative">
                {row.length > 1 && (
                  <div
                    style={{ width: inView ? "100%" : "0%", transitionDelay: inView ? "260ms" : "0ms" }}
                    className="absolute left-0 top-9 hidden h-px bg-gradient-to-r from-[var(--rt-brand-primary)]/70 via-[var(--rt-accent)]/70 to-[var(--rt-brand-primary)]/70 transition-all duration-[1100ms] ease-out sm:block sm:top-11"
                  />
                )}

                <div className="grid gap-6 sm:grid-cols-3 sm:items-start sm:gap-8">
                  {row.map((step, colIndex) => {
                    const i = rowIndex * 3 + colIndex;
                    const Icon = ICONS[step.icon ?? ""] ?? DEFAULT_ICON_BY_INDEX[i] ?? Globe2;
                    return (
                      <div
                        key={step.number}
                        style={{ transitionDelay: inView ? `${300 + i * 150}ms` : "0ms" }}
                        className={`group relative flex flex-col items-center rounded-2xl px-3 py-3 transition-all duration-300 hover:-translate-y-1.5 ${
                          inView ? "translate-y-0 opacity-100 duration-700" : "translate-y-5 opacity-0 duration-700"
                        }`}
                      >
                        <span className="relative z-10 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full border border-slate-200 bg-white text-3xl font-bold text-slate-900 shadow-sm transition-all duration-300 group-hover:border-[var(--rt-accent)] group-hover:shadow-[0_0_0_6px_rgba(127,191,63,0.12)] sm:h-[5.5rem] sm:w-[5.5rem] sm:text-5xl">
                          {step.number}
                        </span>

                        <div className="mt-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--rt-brand-primary)]/10 text-[var(--rt-brand-primary)] transition-colors duration-300 group-hover:bg-[var(--rt-accent)]/10 group-hover:text-[var(--rt-accent)]">
                          <Icon className="h-5 w-5" strokeWidth={1.75} />
                        </div>

                        <h3 className="mt-3 font-semibold text-slate-900">{step.title}</h3>
                        <p className="mt-1.5 text-sm text-slate-500">{step.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {(ctaTitle || ctaSubtitle || buttonText) && (
          <div
            style={{ transitionDelay: inView ? `${300 + steps.length * 150 + 100}ms` : "0ms" }}
            className={`mt-14 transition-all duration-700 ${inView ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}
          >
            {ctaTitle && <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">{ctaTitle}</h3>}
            {ctaSubtitle && <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500 sm:text-base">{ctaSubtitle}</p>}

            {buttonText && (
              <Link
                to={buttonUrl}
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[var(--rt-accent)] px-6 py-3 font-semibold text-slate-900 transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110"
              >
                {buttonText} <span aria-hidden>→</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
