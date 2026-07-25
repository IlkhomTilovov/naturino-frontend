import { Link } from "react-router-dom";
import type { PageSectionContent } from "../../../../types/page";

interface StatItem {
  value?: string;
  label?: string;
}

const NAT = { forest: "#294A34", oil: "#7F9773", taupe: "#9F8A6C" } as const;

// Text banner with a row of key numbers baked in (e.g. "20+ eksport bozori") —
// useful for trust-building on category/company pages.
export function StatsHeroSection({ content }: { content: PageSectionContent }) {
  const eyebrow = content.eyebrow as string | undefined;
  const title = content.title as string | undefined;
  const subtitle = content.subtitle as string | undefined;
  const buttonText = content.buttonText as string | undefined;
  const buttonUrl = (content.buttonUrl as string | undefined) || "/";
  const stats = ((content.stats as StatItem[] | undefined) ?? []).filter((s) => s.value || s.label);

  if (!eyebrow && !title && !subtitle) return null;

  return (
    <section
      className="px-6 py-16 sm:py-20"
      style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #F3EDE1 100%)" }}
    >
      <div className="mx-auto max-w-3xl text-center">
        {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: NAT.oil }}>{eyebrow}</p>}
        {title && (
          <h1 style={{ color: NAT.forest }} className="mt-3 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
            {title}
          </h1>
        )}
        {subtitle && (
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed sm:text-lg" style={{ color: NAT.taupe }}>
            {subtitle}
          </p>
        )}
        {buttonText && (
          <Link
            to={buttonUrl}
            className="mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110"
            style={{ background: NAT.forest }}
          >
            {buttonText} <span aria-hidden>→</span>
          </Link>
        )}

        {stats.length > 0 && (
          <div className="mt-12 grid grid-cols-2 gap-6 border-t pt-10 sm:grid-cols-4" style={{ borderColor: "#E7EBDD" }}>
            {stats.map((stat, i) => (
              <div key={i}>
                <p className="text-3xl font-extrabold" style={{ color: NAT.forest }}>{stat.value}</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide" style={{ color: NAT.taupe }}>{stat.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
