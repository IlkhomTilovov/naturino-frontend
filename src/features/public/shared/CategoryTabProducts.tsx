import { useQuery } from "@tanstack/react-query";
import { productCategoriesApi, productsApi } from "../../../api/endpoints/products";
import { ProductCard } from "../../../components/shared/ProductCard";

// Auto-injected below the CMS content on a category's "Itlar uchun" / "Mushuklar
// uchun" tab pages — shows that category's own products, no picker needed since
// the category is already fixed by the URL.
export function CategoryTabProducts({ categorySlug }: { categorySlug: string }) {
  const { data: categories } = useQuery({
    queryKey: ["product-categories", "public"],
    queryFn: productCategoriesApi.getAll,
  });

  const category = categories?.find((c) => c.slug === categorySlug);

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
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
