import { useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { PageSectionContent } from "../../../../types/page";
import { useInView } from "../../../../lib/hooks/useInView";
import { FALLBACK_IMAGE, resolveMediaUrl } from "../../../../lib/utils/media";
import { productCategoriesApi } from "../../../../api/endpoints/products";
import { localizedCategoryField } from "../../../../lib/product/localizedCategory";
import { useLanguage } from "../../../../i18n/LanguageContext";

// Naturino Pantone palette (base: Oil Green). Hard-coded so the light hero keeps
// its intended brand look regardless of the theme editor's runtime tokens.
const NAT = {
  forest: "#294A34", // 19-6026 Forest Green — headings, brand, button outline
  oil: "#7F9773", //    17-0115 Oil Green — accent, icons
  herb: "#B3C3A6", //   14-0210 Herb Green — soft lines / fills
  sand: "#DDCBB0", //   13-1106 Sand Dollar — card panels
  snow: "#F3EDE1", //   11-0602 Snow White — airy background
  taupe: "#9F8A6C", //  16-1105 Plaza Taupe — secondary text
} as const;

function fadeUp(inView: boolean, delayMs: number): CSSProperties {
  return {
    transitionDelay: inView ? `${delayMs}ms` : "0ms",
    transform: inView ? "translateY(0)" : "translateY(1rem)",
    opacity: inView ? 1 : 0,
  };
}

const fadeBase = "transition-all duration-700 ease-out";

function firstBanner(content: PageSectionContent) {
  const banners = content.banners as Array<Record<string, unknown>> | undefined;
  const active = (banners ?? []).filter((b) => b.isActive !== false);
  return active[0] ?? (content as Record<string, unknown>);
}

export function HeroSection({ content }: { content: PageSectionContent; enableScrollFrames?: boolean }) {
  const { language } = useLanguage();
  const banner = firstBanner(content);

  const brand = (banner.title as string | undefined) ?? "NATURINO";
  const highlight = banner.highlight as string | undefined;
  const tagline =
    (banner.subtitle as string | undefined) ??
    "Naturino mushuk va itlar uchun premium ozuqa ishlab chiqaradi va xalqaro bozorlarga eksport qiladi.";

  const { ref: inViewRef, inView } = useInView<HTMLDivElement>();

  const { data: categories } = useQuery({
    queryKey: ["product-categories", "public"],
    queryFn: productCategoriesApi.getAll,
  });

  // Carousel over the active categories — one card visible at a time.
  const slides = (categories ?? []).filter((c) => c.isActive);
  const count = slides.length;
  const [active, setActive] = useState(0);
  const clamped = Math.min(active, Math.max(0, count - 1));
  const goPrev = () => setActive((i) => (i - 1 + count) % count);
  const goNext = () => setActive((i) => (i + 1) % count);

  return (
    <section
      className="relative overflow-hidden px-6 pb-16 pt-14 sm:pb-24 sm:pt-20"
      style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #F3EDE1 100%)" }}
    >
      {/* Soft brand-green glow behind the product. Contained to an ellipse around
          the packaging (≈68% x, 50% y) that fully fades by ~80% height, so the
          section's bottom edge stays pure #F3EDE1 and blends seamlessly into the
          next section instead of leaving a tinted seam. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(35% 30% at 68% 50%, rgba(46,107,62,0.09) 0%, transparent 100%)" }}
      />

      <div ref={inViewRef} style={fadeUp(inView, 0)} className={`relative mx-auto max-w-6xl ${fadeBase}`}>
        {count > 0 ? (
          // The whole slide (text + image) cross-fades as one unit — no horizontal
          // sliding, so the two-column layout never briefly shows a mismatched
          // "image | text" arrangement mid-transition; both sides change together.
          <div className="relative">
            {slides.map((category, i) => {
              const name = localizedCategoryField(category, language, "name") ?? category.name;
              const desc = localizedCategoryField(category, language, "description") || tagline;
              const img = resolveMediaUrl(category.imageUrl) ?? FALLBACK_IMAGE;
              const isActive = i === clamped;
              return (
                <div
                  key={category.id}
                  className={`transition-opacity duration-500 ease-out ${
                    isActive ? "relative opacity-100" : "pointer-events-none absolute inset-0 opacity-0"
                  }`}
                >
                  <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
                      {/* LEFT — this category's text */}
                      <div className="text-center lg:text-left">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: NAT.oil }}>
                          {brand}
                          {highlight ? ` ${highlight}` : ""}
                        </p>
                        <h1
                          style={{ color: NAT.forest }}
                          className="mt-3 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
                        >
                          {name}
                        </h1>
                        <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed sm:text-lg lg:mx-0" style={{ color: NAT.taupe }}>
                          {desc}
                        </p>
                        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                          <Link
                            to={`/categories/${category.slug}`}
                            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110"
                            style={{ background: NAT.forest }}
                          >
                            Batafsil <span aria-hidden>→</span>
                          </Link>
                          <Link
                            to="/partnership"
                            className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition-colors hover:bg-[#EFF2E9]"
                            style={{ borderColor: NAT.forest, color: NAT.forest }}
                          >
                            Hamkorlik <span aria-hidden>→</span>
                          </Link>
                        </div>
                      </div>

                      {/* RIGHT — this category's image */}
                      <div className="flex h-80 w-full items-center justify-center sm:h-[34rem]">
                        <img
                          src={img}
                          alt={name ?? category.name}
                          loading={i === 0 ? "eager" : "lazy"}
                          decoding="async"
                          className="max-h-80 w-auto max-w-full object-contain drop-shadow-[0_25px_45px_rgba(41,74,52,0.18)] sm:max-h-[34rem]"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          // No categories yet — plain brand hero.
          <div className="text-center lg:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: NAT.oil }}>
              Naturino
            </p>
            <h1
              style={{ color: NAT.forest }}
              className="mt-3 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
            >
              {brand}
              {highlight && (
                <span className="mt-1 block" style={{ color: NAT.oil }}>
                  {highlight}
                </span>
              )}
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed sm:text-lg lg:mx-0" style={{ color: NAT.taupe }}>
              {tagline}
            </p>
          </div>
        )}
      </div>

      {/* Navigation — arrows flanking the dots, centred BELOW the whole hero
          (under both the text and the image). */}
      {count > 1 && (
        <div className="relative mt-12 flex items-center justify-center gap-5">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Oldingi"
            className="flex h-11 w-11 items-center justify-center rounded-full border bg-white shadow-sm transition-colors hover:bg-[#EFF2E9]"
            style={{ borderColor: NAT.herb, color: NAT.forest }}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2">
            {slides.map((category, i) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`${i + 1}-toifa`}
                aria-current={i === clamped}
                className="h-2 rounded-full transition-all duration-300"
                style={{ width: i === clamped ? 22 : 8, background: i === clamped ? NAT.forest : NAT.herb }}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={goNext}
            aria-label="Keyingi"
            className="flex h-11 w-11 items-center justify-center rounded-full border bg-white shadow-sm transition-colors hover:bg-[#EFF2E9]"
            style={{ borderColor: NAT.herb, color: NAT.forest }}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </section>
  );
}
