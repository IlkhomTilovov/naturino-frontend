import { useQuery } from "@tanstack/react-query";
import { productCategoriesApi, productsApi } from "../../../api/endpoints/products";
import { ProductCard } from "../../../components/shared/ProductCard";

// Auto-injected below the CMS content on a category's "Itlar uchun" / "Mushuklar
// uchun" tab pages — shows that category's own products, no picker needed since
// the category is already fixed by the URL.
export function CategoryTabProducts({ categorySlug, tab }: { categorySlug: string; tab: string }) {
  const basePath = `/categories/${categorySlug}/${tab}`;

  const { data: categories } = useQuery({
    queryKey: ["product-categories", "public"],
    queryFn: productCategoriesApi.getAll,
  });

  // categorySlug is the parent Toifa's slug (e.g. "quruq-ozuqa") — products are
  // never attached to the Toifa itself, only to its "it-"/"mushuk-" Sub-toifa,
  // so look up the sub-category that matches this tab's species instead.
  const speciesPrefix = tab === "mushuklar-uchun" ? "mushuk" : "it";
  const category = categories?.find((c) => c.slug === `${speciesPrefix}-${categorySlug}`);

  const { data, isLoading } = useQuery({
    queryKey: ["products", "category-tab", category?.id],
    queryFn: () => productsApi.getPaged({ page: 1, pageSize: 12, isActive: true, categoryId: category!.id }),
    enabled: Boolean(category?.id),
  });

  const products = data?.items ?? [];

  if (category && !isLoading && products.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-6 pb-16 sm:pb-20">
      {isLoading && (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-2xl bg-[#E9E1D0]" />
          ))}
        </div>
      )}

      {!isLoading && products.length > 0 && (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} basePath={basePath} />
          ))}
        </div>
      )}
    </section>
  );
}
