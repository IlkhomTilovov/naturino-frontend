import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { productCategoriesApi } from "../../../../api/endpoints/products";
import { FALLBACK_IMAGE, resolveMediaUrl } from "../../../../lib/utils/media";
import type { PageSectionContent } from "../../../../types/page";

export function ProductRangeSection({ content }: { content: PageSectionContent }) {
  const eyebrow = content.eyebrow as string | undefined;
  const title = content.title as string | undefined;
  const subtitle = content.subtitle as string | undefined;
  const categorySlugs = (content.categorySlugs as string[] | undefined) ?? [];

  const { data: categories } = useQuery({
    queryKey: ["product-categories", "public"],
    queryFn: productCategoriesApi.getAll,
  });

  const visible = (categories ?? [])
    .filter((c) => c.isActive)
    .filter((c) => categorySlugs.length === 0 || categorySlugs.includes(c.slug));

  if (!title && visible.length === 0) return null;

  return (
    <section className="bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          {eyebrow && <p className="text-xs font-semibold uppercase tracking-wide text-[var(--rt-brand-primary)]">{eyebrow}</p>}
          {title && <h2 className="mt-3 text-3xl font-bold text-slate-900">{title}</h2>}
          {subtitle && <p className="mt-3 text-slate-500">{subtitle}</p>}
        </div>

        {visible.length > 0 && (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {visible.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.slug}`}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-lg"
              >
                <div className="aspect-square bg-slate-100">
                  <img
                    src={resolveMediaUrl(category.imageUrl) ?? FALLBACK_IMAGE}
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-slate-900">{category.name}</h3>
                  <p className="mt-1 text-xs text-slate-400">{category.productCount} mahsulot</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
