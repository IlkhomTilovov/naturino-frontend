import type { PageSectionContent } from "../../../../types/page";
import { FALLBACK_IMAGE, resolveMediaUrl } from "../../../../lib/utils/media";
import { useInView } from "../../../../lib/hooks/useInView";
import { bgVariantClasses } from "../../../../lib/utils/sectionBgVariant";

interface Step {
  title: string;
  description?: string;
}

// Image anchors one side, an ordered step list fills the other — for a
// process page that wants a single strong production photo instead of one
// image per step (see ProcessCardGrid for that variant).
export function ProcessSplitImageSection({ content }: { content: PageSectionContent }) {
  const eyebrow = content.eyebrow as string | undefined;
  const title = content.title as string | undefined;
  const subtitle = content.subtitle as string | undefined;
  const steps = (content.steps as Step[] | undefined) ?? [];
  const imageSrc = resolveMediaUrl(content.imageUrl as string | undefined) ?? FALLBACK_IMAGE;
  const { ref, inView } = useInView<HTMLDivElement>();
  const bg = bgVariantClasses(content.bgVariant as string | undefined, "bg-white");

  if (!title) return null;

  return (
    <section className={`${bg.section} px-4 py-20 sm:px-6 sm:py-24`}>
      <div ref={ref} className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div
          className={`overflow-hidden rounded-[28px] shadow-[0_15px_40px_rgba(0,0,0,0.08)] transition-all duration-700 ${
            inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <img src={imageSrc} alt={title} loading="lazy" decoding="async" className="h-80 w-full object-cover sm:h-[28rem]" />
        </div>

        <div>
          {eyebrow && <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${bg.eyebrow}`}>{eyebrow}</p>}
          <h2 className={`mt-4 text-3xl font-bold leading-tight sm:text-4xl ${bg.heading}`}>{title}</h2>
          {subtitle && <p className={`mt-3 ${bg.body}`}>{subtitle}</p>}

          {steps.length > 0 && (
            <ol className="mt-6 space-y-5">
              {steps.map((step, i) => (
                <li
                  key={i}
                  style={{ transitionDelay: inView ? `${150 + i * 100}ms` : "0ms" }}
                  className={`flex gap-4 transition-all duration-700 ${
                    inView ? "translate-x-0 opacity-100" : "-translate-x-3 opacity-0"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold ${
                      bg.isDark ? "border-[var(--rt-accent)] text-[var(--rt-accent)]" : "border-[var(--rt-brand-primary)] text-[var(--rt-brand-primary)]"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <h3 className={`font-semibold ${bg.heading}`}>{step.title}</h3>
                    {step.description && <p className={`mt-1 text-sm ${bg.body}`}>{step.description}</p>}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </section>
  );
}
