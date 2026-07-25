import { Link } from "react-router-dom";
import type { PageSectionContent } from "../../../../types/page";

const NAT = { forest: "#294A34", oil: "#7F9773", taupe: "#9F8A6C" } as const;

// The plainest possible page opener — eyebrow/title/subtitle/one button, no
// image, compact vertical padding. For simple utility/info pages.
export function MinimalHeroSection({ content }: { content: PageSectionContent }) {
  const eyebrow = content.eyebrow as string | undefined;
  const title = content.title as string | undefined;
  const subtitle = content.subtitle as string | undefined;
  const buttonText = content.buttonText as string | undefined;
  const buttonUrl = (content.buttonUrl as string | undefined) || "/";

  if (!eyebrow && !title && !subtitle) return null;

  return (
    <section className="px-6 py-14 sm:py-16">
      <div className="mx-auto max-w-2xl text-center">
        {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: NAT.oil }}>{eyebrow}</p>}
        {title && (
          <h1 style={{ color: NAT.forest }} className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
            {title}
          </h1>
        )}
        {subtitle && (
          <p className="mx-auto mt-3 max-w-xl text-base" style={{ color: NAT.taupe }}>
            {subtitle}
          </p>
        )}
        {buttonText && (
          <Link
            to={buttonUrl}
            className="mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110"
            style={{ background: NAT.forest }}
          >
            {buttonText} <span aria-hidden>→</span>
          </Link>
        )}
      </div>
    </section>
  );
}
