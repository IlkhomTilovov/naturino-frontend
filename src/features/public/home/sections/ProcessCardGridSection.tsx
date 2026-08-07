import type { PageSectionContent } from "../../../../types/page";
import { FALLBACK_IMAGE, resolveMediaUrl } from "../../../../lib/utils/media";
import { useInView } from "../../../../lib/hooks/useInView";

interface Step {
  title: string;
  description?: string;
  imageUrl?: string;
}

// Each process step gets its own photo card — for a process that's visually
// distinct at every stage (raw materials → mixing → packaging → shipping).
export function ProcessCardGridSection({ content }: { content: PageSectionContent }) {
  const eyebrow = content.eyebrow as string | undefined;
  const title = content.title as string | undefined;
  const subtitle = content.subtitle as string | undefined;
  const steps = (content.steps as Step[] | undefined) ?? [];
  const { ref, inView } = useInView<HTMLDivElement>();

  if (!title) return null;

  return (
    <section className="bg-[#F3EDE1] px-4 py-16 sm:px-6 sm:py-24">
      <div ref={ref} className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--rt-brand-primary)]">{eyebrow}</p>
          )}
          <h2 className="mt-4 text-3xl font-bold leading-tight text-[#294A34] sm:text-4xl">{title}</h2>
          {subtitle && <p className="mx-auto mt-4 max-w-2xl text-base text-taupe sm:text-lg">{subtitle}</p>}
        </div>

        {steps.length > 0 && (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <div
                key={i}
                style={{ transitionDelay: inView ? `${i * 100}ms` : "0ms" }}
                className={`overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-700 hover:-translate-y-1 hover:shadow-md ${
                  inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
              >
                <div className="relative">
                  <img
                    src={resolveMediaUrl(step.imageUrl) ?? FALLBACK_IMAGE}
                    alt={step.title}
                    loading="lazy"
                    decoding="async"
                    className="h-36 w-full object-cover"
                  />
                  <span className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--rt-brand-primary)] text-sm font-bold text-white shadow-sm">
                    {i + 1}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-[#294A34]">{step.title}</h3>
                  {step.description && <p className="mt-1 text-sm text-taupe">{step.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
