import { Link } from "react-router-dom";
import type { PageSectionContent } from "../../../../types/page";
import { FALLBACK_IMAGE, resolveMediaUrl } from "../../../../lib/utils/media";

const NAT = { forest: "#294A34", oil: "#7F9773", taupe: "#9F8A6C" } as const;

// Split banner — text + a checklist of trust badges on the left, image on the
// right. For category/company pages that need to establish credibility fast.
export function BadgeListHeroSection({ content }: { content: PageSectionContent }) {
  const eyebrow = content.eyebrow as string | undefined;
  const title = content.title as string | undefined;
  const subtitle = content.subtitle as string | undefined;
  const buttonText = content.buttonText as string | undefined;
  const buttonUrl = (content.buttonUrl as string | undefined) || "/";
  const checklist = (content.checklist as string[] | undefined)?.filter(Boolean) ?? [];
  const imageUrl = resolveMediaUrl(content.imageUrl as string | undefined);

  if (!eyebrow && !title && !subtitle) return null;

  return (
    <section
      className="px-6 py-16 sm:py-20"
      style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #F3EDE1 100%)" }}
    >
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="text-center lg:text-left">
          {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: NAT.oil }}>{eyebrow}</p>}
          {title && (
            <h1 style={{ color: NAT.forest }} className="mt-3 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed sm:text-lg lg:mx-0" style={{ color: NAT.taupe }}>
              {subtitle}
            </p>
          )}

          {checklist.length > 0 && (
            <ul className="mx-auto mt-6 flex max-w-lg flex-wrap justify-center gap-2.5 lg:mx-0 lg:justify-start">
              {checklist.map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold"
                  style={{ borderColor: "#E7EBDD", color: NAT.forest }}
                >
                  <span style={{ color: NAT.oil }}>✓</span> {item}
                </li>
              ))}
            </ul>
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
