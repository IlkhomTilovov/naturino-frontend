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
  const backgroundImageUrl = resolveMediaUrl(content.backgroundImageUrl as string | undefined);

  if (!eyebrow && !title && !subtitle) return null;

  return (
    <section className="relative overflow-hidden px-6 py-24 sm:py-32">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : undefined, backgroundColor: "#294A34" }}
      />
      <div className="absolute inset-0 bg-[#0F1A12]/55" />

      <div className="relative mx-auto max-w-3xl text-center">
        {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--rt-accent)]">{eyebrow}</p>}
        {title && <h1 className="mt-4 text-4xl font-extrabold leading-[1.1] text-white sm:text-5xl">{title}</h1>}
        {subtitle && <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">{subtitle}</p>}
        {buttonText && (
          <Link
            to={buttonUrl}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--rt-accent)] px-6 py-3 text-sm font-semibold text-[#294A34] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110"
          >
            {buttonText} <span aria-hidden>→</span>
          </Link>
        )}
      </div>
    </section>
  );
}
