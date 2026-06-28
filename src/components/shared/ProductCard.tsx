import { Link } from "react-router-dom";
import type { Product } from "../../types/product";
import { FALLBACK_IMAGE, resolveMediaUrl } from "../../lib/utils/media";
import { localizedProductField } from "../../lib/product/localizedProduct";
import { useLanguage } from "../../i18n/LanguageContext";

function categoryBadges(categoryName: string): string[] {
  return categoryName
    .split(/[-·]/)
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 2);
}

export function ProductCard({ product }: { product: Product }) {
  const { language } = useLanguage();
  const primaryImage = product.images.find((i) => i.isPrimary) ?? product.images[0];
  const imageSrc = resolveMediaUrl(primaryImage?.url) ?? FALLBACK_IMAGE;
  const badges = categoryBadges(product.categoryName);
  const name = localizedProductField(product, language, "name");
  const shortDescription = localizedProductField(product, language, "shortDescription");

  const specs = [
    product.sku && { label: "SKU", value: product.sku },
    product.weight != null && { label: "Qadoq", value: `${product.weight} kg` },
    product.ageGroup && { label: "Yosh guruhi", value: product.ageGroup },
    product.brand && { label: "Brend", value: product.brand },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-[28px] border border-black/[0.06] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)]"
    >
      {/* Showcase area */}
      <div className="relative flex h-56 items-center justify-center bg-[#F7F8F5] px-4 pt-4 sm:h-64">
        {product.isFeatured && (
          <span className="absolute left-4 top-4 z-10 rounded-full bg-[var(--rt-brand-secondary)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            Tavsiya etiladi
          </span>
        )}
        <img
          src={imageSrc}
          alt={name ?? product.name}
          className="mx-auto h-full w-auto max-w-[85%] object-contain transition-transform duration-300 ease-out group-hover:scale-[1.03]"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
          }}
        />
      </div>

      {/* Content — overlaps the showcase area slightly */}
      <div className="relative z-10 -mt-5 flex flex-1 flex-col rounded-[20px] bg-white p-5 shadow-[0_8px_20px_rgba(0,0,0,0.05)]">
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {badges.map((badge) => (
              <span
                key={badge}
                className="rounded-full bg-[var(--rt-brand-secondary)]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--rt-brand-secondary)] transition-colors duration-300 group-hover:bg-[var(--rt-accent)]/15 group-hover:text-[var(--rt-accent)]"
              >
                {badge}
              </span>
            ))}
          </div>
        )}

        <h3 className="mt-3 line-clamp-2 text-base font-bold leading-snug text-slate-900">{name}</h3>

        {shortDescription && (
          <p className="mt-1.5 line-clamp-1 text-sm text-slate-500">{shortDescription}</p>
        )}

        {specs.length > 0 && (
          <dl className="mt-4 grid grid-cols-2 gap-y-1.5 border-t border-slate-100 pt-4 text-xs">
            {specs.map((spec) => (
              <div key={spec.label} className="flex items-center justify-between gap-2 pr-2">
                <dt className="text-slate-400">{spec.label}</dt>
                <dd className="font-semibold text-slate-700">{spec.value}</dd>
              </div>
            ))}
          </dl>
        )}

        <span className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-[var(--rt-brand-primary)] py-2.5 text-sm font-semibold text-white transition-colors duration-300 group-hover:bg-[var(--rt-accent)] group-hover:text-slate-900">
          Batafsil <span aria-hidden>→</span>
        </span>

        {product.stockQuantity <= 0 && (
          <span className="mt-2 text-center text-xs font-medium text-red-500">Sotuvda yo'q</span>
        )}
      </div>
    </Link>
  );
}
