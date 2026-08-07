import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import type { ProductCategory } from "../../../../types/product";
import { useInView } from "../../../../lib/hooks/useInView";
import { FALLBACK_IMAGE, resolveMediaUrl } from "../../../../lib/utils/media";
import { productCategoriesApi } from "../../../../api/endpoints/products";
import { localizedCategoryField } from "../../../../lib/product/localizedCategory";
import { useLanguage } from "../../../../i18n/LanguageContext";

function fadeUp(inView: boolean, delayMs: number): CSSProperties {
  return {
    transitionDelay: inView ? `${delayMs}ms` : "0ms",
    transform: inView ? "translateY(0)" : "translateY(1rem)",
    opacity: inView ? 1 : 0,
  };
}

const fadeBase = "transition-all duration-700 ease-out";

// One card per top-level Toifa. Exactly one is always "active" (expanded) —
// the middle one by default, or whichever card the visitor is hovering —
// so the panel never sits in a neutral all-equal state; there's always a
// clear focal Toifa, the way the reference design wanted it.
function CategoryCard({
  category,
  name,
  description,
  active,
  mobileVisible,
  onHover,
}: {
  category: ProductCategory;
  name: string;
  description?: string | null;
  active: boolean;
  mobileVisible: boolean;
  onHover: () => void;
}) {
  const img = resolveMediaUrl(category.imageUrl) ?? FALLBACK_IMAGE;
  return (
    <Link
      to={`/categories/${category.slug}`}
      onMouseEnter={onHover}
      onFocus={onHover}
      className={`relative h-[280px] min-w-0 overflow-hidden rounded-3xl transition-all duration-500 ease-in-out sm:block sm:h-auto ${
        mobileVisible ? "block" : "hidden"
      } ${active ? "sm:flex-[2.4]" : "sm:flex-1"}`}
    >
      <img
        src={img}
        alt={name}
        loading="lazy"
        decoding="async"
        className={`absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out ${active ? "sm:scale-105" : ""}`}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
      <p className="absolute left-0 top-0 p-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70 sm:p-8">
        Toifa
      </p>
      <div className="relative flex h-full flex-col justify-end p-6 sm:p-8">
        <h3 className="truncate text-2xl font-extrabold leading-tight text-white sm:text-3xl">{name}</h3>
        {description && (
          <p
            className={`mt-3 max-w-md overflow-hidden text-sm leading-relaxed text-white/80 transition-all duration-300 ${
              active ? "sm:max-h-40 sm:opacity-100" : "sm:mt-0 sm:max-h-0 sm:opacity-0"
            }`}
          >
            {description}
          </p>
        )}
        <span
          className={`mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#294A34] transition-all duration-300 ${
            active ? "sm:gap-3 sm:opacity-100" : "sm:opacity-0"
          }`}
        >
          Batafsil <span aria-hidden>→</span>
        </span>
      </div>
    </Link>
  );
}

export function HeroSection() {
  const { language } = useLanguage();
  const { ref: inViewRef, inView } = useInView<HTMLDivElement>();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mobileIndex, setMobileIndex] = useState(0);
  const [autoTick, setAutoTick] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const { data: categories } = useQuery({
    queryKey: ["product-categories", "public"],
    queryFn: productCategoriesApi.getAll,
  });

  // Top-level Toifa only — Sub-toifa live one level down, inside their
  // parent's own category browsing area, not on the homepage.
  const slides = (categories ?? []).filter((c) => c.isActive && !c.parentCategoryId).slice(0, 3);
  // The middle card reads as "active" until the visitor hovers a different
  // one; leaving the whole row falls back to that same default.
  const defaultActiveId = slides[1]?.id ?? slides[0]?.id;
  const activeId = hoveredId ?? defaultActiveId;

  // Mobile has no hover, so it gets its own auto-advancing carousel — one
  // card shown at a time, switching every 5s. Desktop ignores this entirely
  // (every card stays visible there via the sm:block override). autoTick
  // lets a manual swipe restart the 5s countdown instead of fighting it.
  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => {
      setMobileIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(id);
  }, [slides.length, autoTick]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || slides.length <= 1) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(deltaX) < 40) return;
    setMobileIndex((i) => (deltaX < 0 ? (i + 1) % slides.length : (i - 1 + slides.length) % slides.length));
    setAutoTick((t) => t + 1);
  };

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

      <div ref={inViewRef} style={fadeUp(inView, 0)} className={`relative mx-auto max-w-[1400px] ${fadeBase}`}>
        {slides.length > 0 && (
          <>
            <div
              className="flex flex-col gap-4 sm:h-[560px] sm:flex-row"
              onMouseLeave={() => setHoveredId(null)}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {slides.map((category, i) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  name={localizedCategoryField(category, language, "name") ?? category.name}
                  description={localizedCategoryField(category, language, "description") ?? category.description}
                  active={category.id === activeId}
                  mobileVisible={i === mobileIndex}
                  onHover={() => setHoveredId(category.id)}
                />
              ))}
            </div>

            {slides.length > 1 && (
              <div className="mt-4 flex items-center justify-center gap-2 sm:hidden">
                {slides.map((category, i) => (
                  <span
                    key={category.id}
                    aria-hidden
                    className="h-1.5 rounded-full transition-all duration-300"
                    style={{
                      width: i === mobileIndex ? 22 : 8,
                      background: i === mobileIndex ? "#294A34" : "#DDD3C2",
                    }}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
