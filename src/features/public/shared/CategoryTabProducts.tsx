import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { productCategoriesApi, productsApi } from "../../../api/endpoints/products";
import { ProductCard } from "../../../components/shared/ProductCard";

const PAGE_STEP = 12;
const FETCH_SIZE = 100;

// Auto-injected below the CMS content on a category's "Itlar uchun" / "Mushuklar
// uchun" tab pages — shows that category's own products, no picker needed since
// the category is already fixed by the URL. Layout adapts to how many products
// actually exist: a couple of SKUs get a compact, left-aligned shelf with a
// "request full catalog" nudge instead of a mostly-empty 4-column grid; a real
// catalog gets filters and a reveal-more control.
export function CategoryTabProducts({ categorySlug, tab }: { categorySlug: string; tab: string }) {
  const basePath = `/categories/${categorySlug}/${tab}`;
  const speciesLabel = tab === "mushuklar-uchun" ? "Mushuk uchun" : "It uchun";

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
    queryFn: () => productsApi.getPaged({ page: 1, pageSize: FETCH_SIZE, isActive: true, categoryId: category!.id }),
    enabled: Boolean(category?.id),
  });

  const allProducts = useMemo(() => data?.items ?? [], [data]);
  const [ageGroup, setAgeGroup] = useState<string | null>(null);
  const [weight, setWeight] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_STEP);

  const ageGroups = useMemo(
    () => Array.from(new Set(allProducts.map((p) => p.ageGroup).filter(Boolean))) as string[],
    [allProducts],
  );
  const weights = useMemo(
    () => Array.from(new Set(allProducts.map((p) => p.weight).filter((w): w is number => w != null))).sort((a, b) => a - b),
    [allProducts],
  );

  const filtered = allProducts.filter((p) => (!ageGroup || p.ageGroup === ageGroup) && (weight == null || p.weight === weight));
  const isCompact = allProducts.length <= 3;
  const visible = filtered.slice(0, visibleCount);
  const hasMore = filtered.length > visibleCount;

  if (category && !isLoading && allProducts.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-6 pb-16 sm:pb-20">
      {isLoading && (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-2xl bg-[#E9E1D0]" />
          ))}
        </div>
      )}

      {!isLoading && allProducts.length > 0 && (
        <>
          <h2 className="text-xl font-bold text-[#294A34] sm:text-2xl">{speciesLabel} mahsulotlar</h2>

          {!isCompact && (ageGroups.length > 0 || weights.length > 0) && (
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {ageGroups.length > 0 && (
                <>
                  <FilterPill active={ageGroup === null} onClick={() => setAgeGroup(null)}>
                    Barcha yoshlar
                  </FilterPill>
                  {ageGroups.map((g) => (
                    <FilterPill key={g} active={ageGroup === g} onClick={() => setAgeGroup(g)}>
                      {g}
                    </FilterPill>
                  ))}
                </>
              )}
              {weights.length > 1 && (
                <>
                  <span className="mx-1 h-4 w-px bg-herb/50" aria-hidden />
                  <FilterPill active={weight === null} onClick={() => setWeight(null)}>
                    Barcha qadoqlar
                  </FilterPill>
                  {weights.map((w) => (
                    <FilterPill key={w} active={weight === w} onClick={() => setWeight(w)}>
                      {w} kg
                    </FilterPill>
                  ))}
                </>
              )}
            </div>
          )}

          <div
            className={
              isCompact
                ? "mt-6 grid justify-start gap-6"
                : "mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4"
            }
            style={isCompact ? { gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" } : undefined}
          >
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} basePath={basePath} />
            ))}

            {isCompact && (
              <Link
                to="/contact"
                className="flex min-h-[22rem] w-full max-w-[280px] flex-col items-center justify-center gap-3 rounded-[28px] border-2 border-dashed border-herb/60 bg-[#F3EDE1]/40 p-6 text-center transition-colors duration-300 hover:border-[var(--rt-brand-primary)] hover:bg-[#F3EDE1]"
              >
                <span className="text-sm text-taupe">To'liq assortimentimiz bilan tanishmoqchimisiz?</span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--rt-brand-primary)] px-5 py-2.5 text-sm font-semibold text-white">
                  Diler sifatida to'liq katalogni so'rang <span aria-hidden>→</span>
                </span>
              </Link>
            )}
          </div>

          {!isCompact && hasMore && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount((n) => n + PAGE_STEP)}
                className="rounded-full border border-[var(--rt-brand-primary)] px-6 py-3 text-sm font-semibold text-[var(--rt-brand-primary)] transition-colors duration-300 hover:bg-[var(--rt-brand-primary)] hover:text-white"
              >
                Yana yuklash
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
        active ? "bg-[var(--rt-brand-primary)] text-white" : "bg-[#E9E1D0] text-slate-600 hover:bg-slate-200"
      }`}
    >
      {children}
    </button>
  );
}
