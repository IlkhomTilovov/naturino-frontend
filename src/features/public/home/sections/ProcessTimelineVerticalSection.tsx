import type { PageSectionContent } from "../../../../types/page";
import { useInView } from "../../../../lib/hooks/useInView";
import { bgVariantClasses } from "../../../../lib/utils/sectionBgVariant";

interface Step {
  title: string;
  description?: string;
}

// A left-aligned, connected vertical timeline — reads better than the
// horizontal ProcessSection when steps have longer descriptions or when
// there are more than 3-4 of them.
export function ProcessTimelineVerticalSection({ content }: { content: PageSectionContent }) {
  const eyebrow = content.eyebrow as string | undefined;
  const title = content.title as string | undefined;
  const subtitle = content.subtitle as string | undefined;
  const steps = (content.steps as Step[] | undefined) ?? [];
  const { ref, inView } = useInView<HTMLDivElement>();
  const bg = bgVariantClasses(content.bgVariant as string | undefined, "default", "bg-white");

  if (!title) return null;

  return (
    <section className={`${bg.section} px-4 py-20 sm:px-6 sm:py-24`}>
      <div ref={ref} className="mx-auto max-w-3xl">
        <div className="text-center">
          {eyebrow && <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${bg.eyebrow}`}>{eyebrow}</p>}
          <h2 className={`mt-4 text-3xl font-bold leading-tight sm:text-4xl ${bg.heading}`}>{title}</h2>
          {subtitle && <p className={`mx-auto mt-4 max-w-2xl text-base sm:text-lg ${bg.body}`}>{subtitle}</p>}
        </div>

        {steps.length > 0 && (
          <ol className={`relative mt-12 border-l-2 pl-8 ${bg.isDark ? "border-white/20" : "border-herb/50"}`}>
            {steps.map((step, i) => (
              <li
                key={i}
                style={{ transitionDelay: inView ? `${i * 120}ms` : "0ms" }}
                className={`relative pb-10 last:pb-0 transition-all duration-700 ${
                  inView ? "translate-x-0 opacity-100" : "-translate-x-3 opacity-0"
                }`}
              >
                <span
                  className={`absolute -left-[calc(2rem+9px)] flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 ${
                    bg.isDark ? "border-[var(--rt-accent)] bg-[var(--rt-brand-primary)]" : "border-[var(--rt-brand-primary)] bg-white"
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full ${bg.isDark ? "bg-[var(--rt-accent)]" : "bg-[var(--rt-brand-primary)]"}`} />
                </span>
                <p className={`text-xs font-bold uppercase tracking-wide ${bg.isDark ? "text-[var(--rt-accent)]" : "text-[var(--rt-brand-secondary)]"}`}>
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className={`mt-1 text-lg font-semibold ${bg.heading}`}>{step.title}</h3>
                {step.description && <p className={`mt-1.5 text-sm ${bg.body}`}>{step.description}</p>}
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
