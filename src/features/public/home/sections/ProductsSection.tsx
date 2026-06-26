import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { productCategoriesApi, productsApi } from "../../../../api/endpoints/products";
import { FALLBACK_IMAGE, resolveMediaUrl } from "../../../../lib/utils/media";
import type { Product } from "../../../../types/product";
import type { PageSectionContent } from "../../../../types/page";

const SLOT_WIDTH = 340;

// Distance-from-center lookup: scale/opacity/blur shrink and the card drops lower
// the further it sits from the active slide, stacking into a pyramid of photos.
const FAN_STOPS = [
  { scale: 1.15, opacity: 1, blur: 0, translateY: 12, z: 40 },
  { scale: 0.82, opacity: 0.55, blur: 1.5, translateY: 40, z: 30 },
  { scale: 0.68, opacity: 0.32, blur: 2.5, translateY: 70, z: 20 },
  { scale: 0.56, opacity: 0.16, blur: 3, translateY: 96, z: 10 },
  { scale: 0.46, opacity: 0.08, blur: 3, translateY: 112, z: 0 },
];

function fanStop(distance: number) {
  return FAN_STOPS[Math.min(distance, FAN_STOPS.length - 1)];
}

function categoryBadges(categoryName: string): string[] {
  return categoryName
    .split(/[-·]/)
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 2);
}

function ShowcaseCard({ product, offset }: { product: Product; offset: number }) {
  const primaryImage = product.images.find((i) => i.isPrimary) ?? product.images[0];
  const imageSrc = resolveMediaUrl(primaryImage?.url) ?? FALLBACK_IMAGE;
  const badges = categoryBadges(product.categoryName);
  const distance = Math.abs(offset);
  const isCenter = distance === 0;
  const stop = fanStop(distance);
  // Pull side cards 50% of their own width toward the center, tucking them further behind it.
  const translateX = offset === 0 ? 0 : (offset < 0 ? 1 : -1) * 50 * distance;

  return (
    <Link
      to={`/products/${product.slug}`}
      style={{
        transform: `translateX(${translateX}%) translateY(${stop.translateY}px) scale(${stop.scale})`,
        opacity: stop.opacity,
        zIndex: stop.z,
        pointerEvents: isCenter ? "auto" : "none",
      }}
      className={`relative mx-auto flex flex-col items-center text-center transition-all duration-500 ease-out ${
        isCenter ? "w-[92vw] sm:w-[640px]" : "hidden w-[60vw] sm:flex sm:w-[420px]"
      }`}
    >
      <div
        className={`flex w-full items-center justify-center ${isCenter ? "h-[300px] sm:h-[420px]" : "h-[220px] sm:h-[300px]"}`}
        style={{ filter: stop.blur ? `blur(${stop.blur}px)` : undefined }}
      >
        <img
          src={imageSrc}
          alt={product.name}
          className="animate-float h-full w-full object-contain"
          style={{ filter: "drop-shadow(0 30px 50px rgba(0,0,0,0.18))" }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
          }}
        />
      </div>

      {isCenter && (
        <>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {product.isFeatured && (
              <span className="rounded-full bg-[var(--rt-accent)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--rt-accent)]">
                Tavsiya etiladi
              </span>
            )}
            {badges.map((badge) => (
              <span
                key={badge}
                className="rounded-full bg-[var(--rt-brand-primary)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--rt-brand-primary)]"
              >
                {badge}
              </span>
            ))}
          </div>

          <h3 className="mt-2 pb-0.5 text-xl font-bold leading-[1.35] text-slate-900 sm:text-2xl">{product.name}</h3>

          {product.shortDescription && (
            <p className="mt-1.5 line-clamp-1 max-w-md text-sm text-slate-500">{product.shortDescription}</p>
          )}
        </>
      )}
    </Link>
  );
}

export function ProductsSection({ content }: { content: PageSectionContent }) {
  const eyebrow = (content.eyebrow as string | undefined) ?? "MAHSULOTLARIMIZ";
  const title = (content.title as string | undefined) ?? "Eksportga tayyor premium mahsulotlar";
  const subtitle =
    (content.subtitle as string | undefined) ??
    "Mushuk va itlar uchun ishlab chiqarilgan premium quruq, ho'l va tortma mahsulotlar. Xalqaro standartlarga mos ishlab chiqarilgan va eksport bozorlari uchun tayyorlangan assortiment.";
  const buttonText = (content.buttonText as string | undefined) ?? "Barcha mahsulotlarni ko'rish";
  const buttonUrl = (content.buttonUrl as string | undefined) ?? "/products";

  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { data: categories } = useQuery({
    queryKey: ["product-categories", "public"],
    queryFn: productCategoriesApi.getAll,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["products", "home-showcase", categoryId],
    queryFn: () => productsApi.getPaged({ page: 1, pageSize: 12, isActive: true, categoryId: categoryId ?? undefined }),
  });

  useEffect(() => {
    setActiveIndex(0);
  }, [categoryId]);

  const items = data?.items ?? [];
  const len = items.length;
  const clampedIndex = Math.min(activeIndex, Math.max(0, len - 1));

  const activeCategories = (categories ?? []).filter((c) => c.isActive);

  const wheelLockRef = useRef(false);
  const touchStartXRef = useRef<number | null>(null);

  const goPrev = () => setActiveIndex((i) => (i - 1 + len) % len);
  const goNext = () => setActiveIndex((i) => (i + 1) % len);

  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) < Math.abs(e.deltaY) || Math.abs(e.deltaX) < 12) return;
    if (wheelLockRef.current) return;
    wheelLockRef.current = true;
    if (e.deltaX > 0) goNext();
    else goPrev();
    window.setTimeout(() => {
      wheelLockRef.current = false;
    }, 450);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const startX = touchStartXRef.current;
    touchStartXRef.current = null;
    if (startX == null) return;
    const deltaX = (e.changedTouches[0]?.clientX ?? startX) - startX;
    if (Math.abs(deltaX) < 40) return;
    if (deltaX < 0) goNext();
    else goPrev();
  };

  return (
    <section
      className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24"
      style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #F8FAF5 100%)" }}
    >
      {/* Soft brand-green glow behind the active product — barely visible, just enough
          to lift the packaging off the background without competing for attention. */}
      <div
        className="pointer-events-none absolute left-1/2 top-[60%] h-[280px] w-[85vw] -translate-x-1/2 -translate-y-1/2 sm:h-[420px] sm:w-[700px] lg:h-[520px] lg:w-[900px]"
        style={{
          background:
            "radial-gradient(circle at center, rgba(46,107,62,0.08) 0%, rgba(46,107,62,0.03) 35%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--rt-brand-primary)]">{eyebrow}</p>
        <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">{title}</h2>
        <p className="mx-auto mt-3 max-w-2xl text-slate-500">{subtitle}</p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setCategoryId(null)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              categoryId === null
                ? "bg-[var(--rt-brand-primary)] text-white"
                : "border border-slate-200 text-slate-600 hover:border-[var(--rt-accent)] hover:text-[var(--rt-accent)]"
            }`}
          >
            Barchasi
          </button>
          {activeCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setCategoryId(category.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                categoryId === category.id
                  ? "bg-[var(--rt-brand-primary)] text-white"
                  : "border border-slate-200 text-slate-600 hover:border-[var(--rt-accent)] hover:text-[var(--rt-accent)]"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {isLoading && (
          <div className="mx-auto mt-16 h-[26rem] max-w-[520px] animate-pulse rounded-[32px] bg-slate-100" />
        )}

        {!isLoading && len === 0 && <p className="mt-16 text-center text-slate-400">Bu kategoriyada mahsulotlar topilmadi.</p>}

        {!isLoading && len > 0 && (
          <>
            {/* Sliding carousel track — stays inside the section's own column. No edge mask:
                side products already fade to near-invisible via FAN_STOPS opacity/blur, so a
                solid-color mask here just drew a visible seam against the gradient background. */}
            <div
              className="relative mt-16 cursor-grab overflow-hidden select-none"
              onWheel={handleWheel}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >

              {/* Card row — buttons are centered against this element's natural (untransformed)
                  height, so they land on the center card's middle regardless of the fan buffer below. */}
              <div className="relative min-h-[600px] pt-2">
                {len > 1 && (
                  <>
                    <button
                      type="button"
                      aria-label="Oldingi mahsulot"
                      onClick={goPrev}
                      className="absolute left-2 top-1/2 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--rt-brand-primary)] bg-white text-[var(--rt-brand-primary)] transition-all duration-300 hover:border-[var(--rt-accent)] hover:text-[var(--rt-accent)] sm:left-6"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      aria-label="Keyingi mahsulot"
                      onClick={goNext}
                      className="absolute right-2 top-1/2 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--rt-brand-primary)] bg-white text-[var(--rt-brand-primary)] transition-all duration-300 hover:border-[var(--rt-accent)] hover:text-[var(--rt-accent)] sm:right-6"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                <div
                  className="flex items-start transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(calc(50% - ${(clampedIndex + 0.5) * SLOT_WIDTH}px))` }}
                >
                  {items.map((product, i) => (
                    <div key={product.id} className="flex shrink-0 items-start justify-center" style={{ width: SLOT_WIDTH }}>
                      <ShowcaseCard product={product} offset={i - clampedIndex} />
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </>
        )}

        {buttonText && (
          <div className="mt-12">
            <Link
              to={buttonUrl}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--rt-accent)] px-6 py-3 font-semibold text-slate-900 transition-colors hover:brightness-110"
            >
              {buttonText} <span aria-hidden>→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
