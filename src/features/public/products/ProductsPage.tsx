import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { productCategoriesApi, productsApi } from "../../../api/endpoints/products";
import { pagesApi } from "../../../api/endpoints/pages";
import { ProductCard } from "../../../components/shared/ProductCard";
import { getSectionTypeName } from "../shared/renderSection";

export function ProductsPage() {
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  const { data: page } = useQuery({
    queryKey: ["page", "by-slug", "products"],
    queryFn: () => pagesApi.getBySlug("products"),
  });

  const heroSection = page?.sections.find((s) => getSectionTypeName(s.sectionType) === "Hero" && s.isEnabled);
  const heroTitle = heroSection?.content.title as string | undefined;
  const heroSubtitle = heroSection?.content.subtitle as string | undefined;

  const { data: categories } = useQuery({
    queryKey: ["product-categories", "public"],
    queryFn: productCategoriesApi.getAll,
  });

  useEffect(() => {
    const categorySlug = searchParams.get("category");
    if (!categorySlug || !categories) return;
    const match = categories.find((c) => c.slug === categorySlug);
    if (match) setCategoryId(match.id);
  }, [searchParams, categories]);

  const { data, isLoading } = useQuery({
    queryKey: ["products", "catalog", categoryId],
    queryFn: () =>
      productsApi.getPaged({ page: 1, pageSize: 50, isActive: true, categoryId: categoryId ?? undefined }),
  });

  const activeCategories = (categories ?? []).filter((c) => c.isActive);

  return (
    <>
      <Helmet>
        <title>{heroTitle ?? "Mahsulotlar"} — Naturino</title>
      </Helmet>

      <section className="relative overflow-hidden bg-[var(--rt-brand-primary)] px-6 pb-14 pt-32 text-center text-white sm:pb-16 sm:pt-36">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--rt-accent) 12%, transparent) 0%, transparent 55%), radial-gradient(circle at 100% 100%, color-mix(in srgb, var(--rt-brand-secondary) 25%, transparent) 0%, transparent 55%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-3xl">
          <p className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--rt-accent)]">
            <span className="text-white/50">Bosh sahifa</span>
            <span aria-hidden className="text-white/30">/</span>
            {(page?.title ?? "Mahsulotlar katalogi").toLocaleUpperCase("uz")}
          </p>
          <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">{heroTitle ?? "Naturino mahsulotlari"}</h1>
          <p className="mx-auto mt-4 max-w-xl text-white/70">
            {heroSubtitle ?? "Mushuklar uchun sifatli va tabiiy ovqatlar — kategoriya bo'yicha tanlang."}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategoryId(null)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              categoryId === null
                ? "bg-[var(--rt-brand-primary)] text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
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
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="mt-10">
          {isLoading && (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square animate-pulse rounded-2xl bg-slate-100" />
              ))}
            </div>
          )}

          {!isLoading && data && data.items.length === 0 && (
            <p className="py-16 text-center text-slate-400">Bu kategoriyada mahsulotlar topilmadi.</p>
          )}

          {!isLoading && data && data.items.length > 0 && (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
              {data.items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
