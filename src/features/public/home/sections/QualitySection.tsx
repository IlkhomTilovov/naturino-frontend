import type { PageSectionContent } from "../../../../types/page";
import { FALLBACK_IMAGE, resolveMediaUrl } from "../../../../lib/utils/media";
import { useInView } from "../../../../lib/hooks/useInView";

export function QualitySection({ content }: { content: PageSectionContent }) {
  const eyebrow = content.eyebrow as string | undefined;
  const title = content.title as string | undefined;
  const subtitle = content.subtitle as string | undefined;
  const items = (content.items as string[] | undefined) ?? [];
  const imageSrc = resolveMediaUrl(content.imageUrl as string | undefined) ?? FALLBACK_IMAGE;
  const { ref, inView } = useInView<HTMLDivElement>();

  if (!title) return null;

  return (
    <section className="bg-[#F8F9F4] px-4 py-16 sm:px-6 sm:py-24">
      <div ref={ref} className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div
          style={{ transitionDelay: inView ? "100ms" : "0ms" }}
          className={`overflow-hidden rounded-[28px] shadow-[0_15px_40px_rgba(0,0,0,0.08)] transition-all duration-700 ${
            inView ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-[0.98] opacity-0"
          }`}
        >
          <img src={imageSrc} alt={title} className="h-80 w-full object-cover sm:h-96" />
        </div>

        <div>
          {eyebrow && (
            <p
              className={`text-xs font-semibold uppercase tracking-[0.2em] text-[var(--rt-brand-secondary)] transition-all duration-700 ${
                inView ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
              }`}
            >
              {eyebrow}
            </p>
          )}
          <h2
            style={{ transitionDelay: inView ? "100ms" : "0ms" }}
            className={`mt-4 text-2xl font-bold leading-tight text-[#0F172A] transition-all duration-700 sm:text-3xl ${
              inView ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
          >
            {title}
          </h2>
          {subtitle && (
            <p
              style={{ transitionDelay: inView ? "200ms" : "0ms" }}
              className={`mt-3 text-slate-600 transition-all duration-700 ${
                inView ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
              }`}
            >
              {subtitle}
            </p>
          )}

          {items.length > 0 && (
            <div
              style={{ transitionDelay: inView ? "300ms" : "0ms" }}
              className={`mt-6 flex flex-wrap gap-2.5 transition-all duration-700 ${
                inView ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
              }`}
            >
              {items.map((item) => (
                <span
                  key={item}
                  className="flex items-center gap-1.5 rounded-full border border-[var(--rt-brand-secondary)]/20 bg-white px-3.5 py-1.5 text-sm font-semibold text-[#0F172A] shadow-sm"
                >
                  <span className="text-[var(--rt-brand-secondary)]">✓</span>
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
