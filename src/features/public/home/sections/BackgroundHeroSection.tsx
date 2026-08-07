import { Link } from "react-router-dom";
import type { PageSectionContent } from "../../../../types/page";
import { resolveMediaUrl } from "../../../../lib/utils/media";

// Full-bleed background-image banner with a dark overlay and centered white
// text — for a dramatic page opener (production/quality/export pages).
export function BackgroundHeroSection({ content }: { content: PageSectionContent }) {
  const eyebrow = content.eyebrow as string | undefined;
  const title = content.title as string | undefined;
  const subtitle = content.subtitle as string | undefined;
  const buttonText = content.buttonText as string | undefined;
  const buttonUrl = (content.buttonUrl as string | undefined) || "/";
  const buttonText2 = content.buttonText2 as string | undefined;
  const buttonUrl2 = (content.buttonUrl2 as string | undefined) || "/";
  const backgroundImageUrl = resolveMediaUrl(content.backgroundImageUrl as string | undefined);
  const isCentered = content.contentAlign === "center";

  if (!eyebrow && !title && !subtitle) return null;

  return (
    <section className="relative w-full overflow-hidden bg-[#294A34]">
      {backgroundImageUrl ? (
        <img src={backgroundImageUrl} alt="" className="block h-[85vh] w-full object-cover object-center" />
      ) : (
        <div className="h-[85vh] w-full" />
      )}
      <div className="absolute inset-0 bg-[#0F1A12]/55" />

      <div
        className={`absolute inset-0 flex items-center px-6 sm:px-12 lg:px-20 ${isCentered ? "justify-center text-center" : ""}`}
      >
        <div className={`max-w-xl ${isCentered ? "mx-auto text-center" : "text-left"}`}>
          {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--rt-accent)]">{eyebrow}</p>}
          {title && <h1 className="mt-4 text-4xl font-extrabold leading-[1.1] text-white sm:text-5xl">{title}</h1>}
          {subtitle && <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">{subtitle}</p>}
          {(buttonText || buttonText2) && (
            <div className={`mt-8 flex flex-wrap items-center gap-4 ${isCentered ? "justify-center" : "justify-start"}`}>
              {buttonText && (
                <Link
                  to={buttonUrl}
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--rt-accent)] px-6 py-3 text-sm font-semibold text-[#294A34] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110"
                >
                  {buttonText} <span aria-hidden>→</span>
                </Link>
              )}
              {buttonText2 && (
                <Link
                  to={buttonUrl2}
                  className="inline-flex items-center gap-2 rounded-full border border-white/70 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10"
                >
                  {buttonText2} <span aria-hidden>→</span>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
