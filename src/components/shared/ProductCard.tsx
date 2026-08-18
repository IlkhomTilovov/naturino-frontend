import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Award, Hash, Scale, User, type LucideIcon } from "lucide-react";
import type { Product } from "../../types/product";
import { FALLBACK_IMAGE, resolveMediaUrl } from "../../lib/utils/media";
import { localizedProductField } from "../../lib/product/localizedProduct";
import { localizedCategoryField } from "../../lib/product/localizedCategory";
import { productCategoriesApi } from "../../api/endpoints/products";
import { useLanguage } from "../../i18n/LanguageContext";

function categoryBadges(categoryName: string): string[] {
  return categoryName
    .split(/[-·]/)
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 2);
}

const CARD_TEXT: Record<string, { featured: string; weight: string; ageGroup: string; brand: string; details: string; outOfStock: string }> = {
  uz: { featured: "Tavsiya etiladi", weight: "Qadoq", ageGroup: "Yosh guruhi", brand: "Brend", details: "Batafsil", outOfStock: "Sotuvda yo'q" },
  ru: { featured: "Рекомендуем", weight: "Вес", ageGroup: "Возрастная группа", brand: "Бренд", details: "Подробнее", outOfStock: "Нет в наличии" },
  en: { featured: "Featured", weight: "Weight", ageGroup: "Age group", brand: "Brand", details: "View more", outOfStock: "Out of stock" },
};

// basePath lets a category's own product listing route detail pages under its
// own URL (e.g. /categories/it-quruq-ozuqa/itlar-uchun/{slug}) instead of the
// generic /products/{slug} — otherwise the navbar's "Mahsulotlar" link lights
// up as active even though the visitor never left the category section.
export function ProductCard({ product, basePath = "/products" }: { product: Product; basePath?: string }) {
  const { language } = useLanguage();
  const t = CARD_TEXT[language] ?? CARD_TEXT.uz;
  // Shares the ["product-categories", "public"] cache key with pages that
  // already fetch it (e.g. ProductsPage's filter pills), so this doesn't
  // fire an extra network request — just reads the localized category name
  // instead of the raw (always-uz) product.categoryName.
  const { data: categories } = useQuery({ queryKey: ["product-categories", "public"], queryFn: productCategoriesApi.getAll });
  const category = categories?.find((c) => c.id === product.categoryId);
  const localizedCategoryName = category ? localizedCategoryField(category, language, "name") : null;
  const primaryImage = product.images.find((i) => i.isPrimary) ?? product.images[0];
  const imageSrc = resolveMediaUrl(primaryImage?.url) ?? FALLBACK_IMAGE;
  const badges = categoryBadges(localizedCategoryName ?? product.categoryName);
  const name = localizedProductField(product, language, "name");

  const specs = [
    product.sku && { label: "SKU", value: product.sku, Icon: Hash },
    product.weight != null && { label: t.weight, value: `${product.weight} kg`, Icon: Scale },
    product.ageGroup && { label: t.ageGroup, value: product.ageGroup, Icon: User },
    product.brand && { label: t.brand, value: product.brand, Icon: Award },
  ].filter(Boolean) as { label: string; value: string; Icon: LucideIcon }[];

  return (
    <Link
      to={`${basePath}/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-[28px] border border-black/[0.06] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)]"
    >
      {/* Showcase area — warm Sand Dollar base gives products a premium, natural stage. */}
      <div className="relative flex h-56 items-center justify-center bg-sand-50 px-2.5 pt-2.5 sm:h-64">
        {product.isFeatured && (
          <span className="absolute left-4 top-4 z-10 rounded-full bg-[var(--rt-brand-secondary)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            {t.featured}
          </span>
        )}
        <img
          src={imageSrc}
          alt={name ?? product.name}
          loading="lazy"
          decoding="async"
          className="mx-auto h-full w-auto max-w-[94%] object-contain transition-transform duration-300 ease-out group-hover:scale-[1.03]"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
          }}
        />
      </div>

      {/* Content — overlaps the showcase area slightly */}
      <div className="relative z-10 -mt-5 flex flex-1 flex-col rounded-[20px] bg-white p-5 shadow-[0_8px_20px_rgba(0,0,0,0.05)]">
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {badges.map((badge, i) => (
              <span
                key={`${badge}-${i}`}
                className={
                  i === 0
                    ? "rounded-full bg-[var(--rt-brand-secondary)]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--rt-brand-secondary)] transition-colors duration-300 group-hover:bg-[var(--rt-accent)]/15 group-hover:text-[var(--rt-accent)]"
                    : "rounded-full border border-[var(--rt-brand-secondary)]/30 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--rt-brand-secondary)]/80 transition-colors duration-300 group-hover:border-[var(--rt-accent)]/50 group-hover:text-[var(--rt-accent)]"
                }
              >
                {badge}
              </span>
            ))}
          </div>
        )}

        <h3 className="mt-2.5 line-clamp-2 text-base font-extrabold leading-snug text-[#294A34]">{name}</h3>

        {specs.length > 0 && (
          <dl className="mt-4 flex flex-col gap-y-2 border-t border-herb/40 pt-4 text-xs">
            {specs.map((spec) => (
              <div key={spec.label} className="flex items-center justify-between gap-2">
                <dt className="flex items-center gap-1.5 text-taupe">
                  <spec.Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  {spec.label}
                </dt>
                <dd className="font-semibold text-[#294A34]">{spec.value}</dd>
              </div>
            ))}
          </dl>
        )}

        <span className="mx-auto mt-5 flex w-full max-w-[80%] items-center justify-center gap-1.5 rounded-xl bg-[var(--rt-brand-primary)] py-2.5 text-sm font-semibold text-white transition-colors duration-300 group-hover:bg-[var(--rt-accent)] group-hover:text-[#294A34]">
          {t.details}
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </span>

        {product.stockQuantity <= 0 && (
          <span className="mt-2 text-center text-xs font-medium text-red-500">{t.outOfStock}</span>
        )}
      </div>
    </Link>
  );
}
