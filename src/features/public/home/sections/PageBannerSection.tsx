import { Link } from "react-router-dom";
import type { PageSectionContent } from "../../../../types/page";
import { FALLBACK_IMAGE, resolveMediaUrl } from "../../../../lib/utils/media";

// Naturino Pantone palette (base: Oil Green) — matches HeroSection's brand look.
const NAT = {
  forest: "#294A34",
  oil: "#7F9773",
  taupe: "#9F8A6C",
} as const;

// A self-contained page header/banner — its own title/subtitle/image per page,
// unlike the "Hero" section type which always renders the homepage's product
// category carousel regardless of which page it's placed on.
export function PageBannerSection({ content }: { content: PageSectionContent }) {
  const eyebrow = content.eyebrow as string | undefined;
  const title = content.title as string | undefined;
  const highlight = content.highlight as string | undefined;
  const subtitle = content.subtitle as string | undefined;
  const primaryButtonText = content.primaryButtonText as string | undefined;
  const primaryButtonUrl = (content.primaryButtonUrl as string | undefined) || "/";
  const secondaryButtonText = content.secondaryButtonText as string | undefined;
  const secondaryButtonUrl = (content.secondaryButtonUrl as string | undefined) || "/";
  const imageUrl = resolveMediaUrl(content.imageUrl as string | undefined);

  const hasText = Boolean(eyebrow || title || subtitle);
  if (!hasText && !imageUrl) return null;

  return (
    <section
      className="relative overflow-hidden px-6 pb-16 pt-14 sm:pb-20 sm:pt-20"
      style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #F3EDE1 100%)" }}
    >
      <div className={`mx-auto max-w-6xl ${imageUrl ? "grid items-center gap-10 lg:grid-cols-2 lg:gap-14" : ""}`}>
        <div className={imageUrl ? "text-center lg:text-left" : "mx-auto max-w-2xl text-center"}>
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: NAT.oil }}>
              {eyebrow}
            </p>
          )}
          {title && (
            <h1
              style={{ color: NAT.forest }}
              className="mt-3 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl"
            >
              {title}
              {highlight && (
                <span className="mt-1 block" style={{ color: NAT.oil }}>
                  {highlight}
                </span>
              )}
            </h1>
          )}
          {subtitle && (
            <p
              className={`mt-5 text-base leading-relaxed sm:text-lg ${imageUrl ? "mx-auto max-w-lg lg:mx-0" : "mx-auto max-w-2xl"}`}
              style={{ color: NAT.taupe }}
            >
              {subtitle}
            </p>
          )}

          {(primaryButtonText || secondaryButtonText) && (
            <div className={`mt-8 flex flex-wrap items-center gap-3 ${imageUrl ? "justify-center lg:justify-start" : "justify-center"}`}>
              {primaryButtonText && (
                <Link
                  to={primaryButtonUrl}
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110"
                  style={{ background: NAT.forest }}
                >
                  {primaryButtonText} <span aria-hidden>→</span>
                </Link>
              )}
              {secondaryButtonText && (
                <Link
                  to={secondaryButtonUrl}
                  className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition-colors hover:bg-[#EFF2E9]"
                  style={{ borderColor: NAT.forest, color: NAT.forest }}
                >
                  {secondaryButtonText} <span aria-hidden>→</span>
                </Link>
              )}
            </div>
          )}
        </div>

        {imageUrl && (
          <div className="flex h-72 w-full items-center justify-center sm:h-[28rem]">
            <img
              src={imageUrl}
              alt={title ?? ""}
              loading="eager"
              decoding="async"
              className="max-h-72 w-auto max-w-full object-contain drop-shadow-[0_25px_45px_rgba(41,74,52,0.18)] sm:max-h-[28rem]"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
              }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
