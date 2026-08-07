import { Link } from "react-router-dom";
import type { PageSectionContent } from "../../../../types/page";
import { FALLBACK_IMAGE, resolveMediaUrl } from "../../../../lib/utils/media";
import { useInView } from "../../../../lib/hooks/useInView";

// Image + benefit checklist split — the WhyPartner equivalent of
// QualityChecklistSection, for a page that wants one strong photo instead
// of a benefit grid (see WhyPartnerIconGrid for that).
export function WhyPartnerSplitImageSection({ content }: { content: PageSectionContent }) {
  const eyebrow = content.eyebrow as string | undefined;
  const title = content.title as string | undefined;
  const subtitle = content.subtitle as string | undefined;
  const checklist = ((content.checklist as string[] | undefined) ?? []).filter(Boolean);
  const buttonText = content.buttonText as string | undefined;
  const buttonUrl = (content.buttonUrl as string | undefined) || "/contact";
  const imageSrc = resolveMediaUrl(content.imageUrl as string | undefined) ?? FALLBACK_IMAGE;
  const { ref, inView } = useInView<HTMLDivElement>();

  if (!title) return null;

  return (
    <section className="bg-white px-4 py-16 sm:px-6 sm:py-24">
      <div ref={ref} className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div
          className={`overflow-hidden rounded-[28px] shadow-[0_15px_40px_rgba(0,0,0,0.08)] transition-all duration-700 ${
            inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <img src={imageSrc} alt={title} loading="lazy" decoding="async" className="h-80 w-full object-cover sm:h-[26rem]" />
        </div>

        <div>
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--rt-brand-secondary)]">{eyebrow}</p>
          )}
          <h2 className="mt-4 text-3xl font-bold leading-tight text-[#294A34] sm:text-4xl">{title}</h2>
          {subtitle && <p className="mt-3 text-taupe">{subtitle}</p>}

          {checklist.length > 0 && (
            <ul className="mt-6 space-y-2.5">
              {checklist.map((item, i) => (
                <li
                  key={i}
                  style={{ transitionDelay: inView ? `${150 + i * 100}ms` : "0ms" }}
                  className={`flex items-center gap-2.5 transition-all duration-700 ${
                    inView ? "translate-x-0 opacity-100" : "-translate-x-3 opacity-0"
                  }`}
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--rt-brand-secondary)]/15 text-xs font-bold text-[var(--rt-brand-secondary)]">
                    ✓
                  </span>
                  <span className="text-[#294A34]">{item}</span>
                </li>
              ))}
            </ul>
          )}

          {buttonText && (
            <Link
              to={buttonUrl}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--rt-brand-primary)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110"
            >
              {buttonText} <span aria-hidden>→</span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
