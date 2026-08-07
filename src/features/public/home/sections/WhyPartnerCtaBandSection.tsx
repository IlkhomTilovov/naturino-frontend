import { Link } from "react-router-dom";
import type { PageSectionContent } from "../../../../types/page";
import { useInView } from "../../../../lib/hooks/useInView";

// A conversion-focused closer — benefit list on the left, a strong CTA on
// the right, in one colored band. Meant to be the last WhyPartner section
// on a page, after the benefit grid/split/quote have made the case.
export function WhyPartnerCtaBandSection({ content }: { content: PageSectionContent }) {
  const title = content.title as string | undefined;
  const subtitle = content.subtitle as string | undefined;
  const checklist = ((content.checklist as string[] | undefined) ?? []).filter(Boolean);
  const buttonText = content.buttonText as string | undefined;
  const buttonUrl = (content.buttonUrl as string | undefined) || "/contact";
  const { ref, inView } = useInView<HTMLDivElement>();

  if (!title) return null;

  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20">
      <div
        ref={ref}
        className={`mx-auto max-w-6xl rounded-[28px] bg-[var(--rt-brand-primary)] p-8 transition-all duration-700 sm:p-12 ${
          inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        <div className="grid items-center gap-8 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <h2 className="text-2xl font-bold leading-tight text-white sm:text-3xl">{title}</h2>
            {subtitle && <p className="mt-3 max-w-xl text-white/70">{subtitle}</p>}

            {checklist.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
                {checklist.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-white/90">
                    <span className="text-[var(--rt-accent)]">✓</span> {item}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {buttonText && (
            <div className="flex lg:justify-end">
              <Link
                to={buttonUrl}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--rt-accent)] px-7 py-3.5 text-sm font-semibold text-[#294A34] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110"
              >
                {buttonText} <span aria-hidden>→</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
