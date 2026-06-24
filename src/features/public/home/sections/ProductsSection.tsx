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
  { scale: 1, opacity: 1, blur: 0, translateY: 0, z: 40 },
  { scale: 0.8, opacity: 0.4, blur: 2, translateY: 46, z: 30 },
  { scale: 0.62, opacity: 0.22, blur: 3, translateY: 78, z: 20 },
  { scale: 0.5, opacity: 0.1, blur: 4, translateY: 102, z: 10 },
  { scale: 0.4, opacity: 0, blur: 4, translateY: 118, z: 0 },
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
          style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.15))" }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
          }}
        />
      </div>

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

      <h3
        className={`mt-2 line-clamp-2 overflow-hidden font-bold leading-snug text-slate-900 ${isCenter ? "text-xl sm:text-2xl" : "text-sm sm:text-base"}`}
      >
        {product.name}
      </h3>

      {isCenter && product.shortDescription && (
        <p className="mt-1.5 line-clamp-1 max-w-md text-sm text-slate-500">{product.shortDescription}</p>
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
    <section className="bg-[#FAFAF7] px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl text-center">
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
            {/* Sliding carousel track — stays inside the section's own column; the gradient masks
                fade the edges so it never looks clipped against the column boundary. */}
            <div
              className="relative mt-16 cursor-grab overflow-hidden select-none"
              onWheel={handleWheel}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div className="pointer-events-none absolute inset-y-0 left-0 z-50 w-16 bg-gradient-to-r from-[#FAFAF7] to-transparent sm:w-28" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-50 w-16 bg-gradient-to-l from-[#FAFAF7] to-transparent sm:w-28" />

              {/* Card row — buttons are centered against this element's natural (untransformed)
                  height, so they land on the center card's middle regardless of the fan buffer below. */}
              <div className="relative pt-2">
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
