import type { PageSectionContent } from "../../../../types/page";
import { resolveMediaUrl } from "../../../../lib/utils/media";
import { useInView } from "../../../../lib/hooks/useInView";

interface Logo {
  imageUrl?: string;
  name?: string;
}

// Country-of-origin badge + a row of certification logos — for pages that
// want to lead with "where/how it's certified" rather than a benefit list
// (see FeatureCardsSection, still used by WhyPartner/WhoWeWorkWith, for that).
export function ExportCapabilitiesSection({ content }: { content: PageSectionContent }) {
  const flag = content.flag as string | undefined;
  const title = content.title as string | undefined;
  const subtitle = content.subtitle as string | undefined;
  const logos = ((content.logos as Logo[] | undefined) ?? []).filter((l) => l.imageUrl);
  const { ref, inView } = useInView<HTMLDivElement>();

  if (!title) return null;

  return (
    <section className="bg-[#F3EDE1] px-4 py-16 sm:px-6 sm:py-20">
      <div ref={ref} className="mx-auto max-w-4xl text-center">
        {flag && <span className="text-4xl leading-none">{flag}</span>}
        <h2 className="mt-3 text-lg font-bold uppercase tracking-wide text-[#294A34] sm:text-xl">{title}</h2>
        {subtitle && <p className="mx-auto mt-3 max-w-xl text-sm text-taupe sm:text-base">{subtitle}</p>}

        {logos.length > 0 && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {logos.map((logo, i) => (
              <div
                key={i}
                style={{ transitionDelay: inView ? `${i * 60}ms` : "0ms" }}
                className={`flex h-16 w-28 items-center justify-center rounded-xl border border-[var(--rt-brand-primary)]/10 bg-white p-3 shadow-sm transition-all duration-700 ${
                  inView ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                }`}
              >
                <img
                  src={resolveMediaUrl(logo.imageUrl) ?? logo.imageUrl}
                  alt={logo.name ?? ""}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-contain grayscale transition-all duration-300 hover:grayscale-0"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
