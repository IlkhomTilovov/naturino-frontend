import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { productCategoriesApi, productsApi } from "../../../api/endpoints/products";
import { pagesApi } from "../../../api/endpoints/pages";
import { ProductCard } from "../../../components/shared/ProductCard";
import { getSectionTypeName } from "../shared/renderSection";
import type { Product } from "../../../types/product";
import { localizedCategoryField } from "../../../lib/product/localizedCategory";
import { useLanguage } from "../../../i18n/LanguageContext";
import { getLocalized } from "../../../lib/page/localizedContent";

const PAGE_SIZE = 12;

export function ProductsPage() {
  const { language } = useLanguage();
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [pageNum, setPageNum] = useState(1);
  const [searchParams] = useSearchParams();

  const { data: cmsPage } = useQuery({
    queryKey: ["page", "by-slug", "products"],
    queryFn: () => pagesApi.getBySlug("products"),
  });

  const heroSection = cmsPage?.sections.find((s) => getSectionTypeName(s.sectionType) === "Hero" && s.isEnabled);
  const heroContent = heroSection ? getLocalized(heroSection.content, language) : null;
  const heroTitle = heroContent?.title as string | undefined;
  const heroSubtitle = heroContent?.subtitle as string | undefined;
  const breadcrumbHome = heroContent?.breadcrumbHome as string | undefined;
  const breadcrumbCurrent = heroContent?.breadcrumbCurrent as string | undefined;

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

  // Reset to the first page whenever the category filter changes.
  useEffect(() => {
    setPageNum(1);
  }, [categoryId]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["products", "catalog", categoryId, pageNum],
    queryFn: () =>
      productsApi.getPaged({ page: pageNum, pageSize: PAGE_SIZE, isActive: true, categoryId: categoryId ?? undefined }),
  });

  const [accumulated, setAccumulated] = useState<Product[]>([]);

  useEffect(() => {
    if (!data) return;
    setAccumulated((prev) => (pageNum === 1 ? data.items : [...prev, ...data.items]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, pageNum]);

  const activeCategories = (categories ?? []).filter((c) => c.isActive);
  const hasMore = Boolean(data && accumulated.length < data.totalCount);

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
            <span className="text-white/50">{breadcrumbHome ?? "Bosh sahifa"}</span>
            <span aria-hidden className="text-white/30">/</span>
            {(breadcrumbCurrent ?? cmsPage?.title ?? "Mahsulotlar katalogi").toLocaleUpperCase("uz")}
          </p>
          <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">{heroTitle ?? "Naturino mahsulotlari"}</h1>
          <p className="mx-auto mt-4 max-w-xl text-white/70">
            {heroSubtitle ?? "It va mushuklar uchun premium, sertifikatlangan ozuqalar — kategoriya bo'yicha tanlang."}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          <button
            type="button"
            onClick={() => setCategoryId(null)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
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
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                categoryId === category.id
                  ? "bg-[var(--rt-brand-primary)] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {localizedCategoryField(category, language, "name")}
            </button>
          ))}
        </div>

        <div className="mt-10">
          {isLoading && pageNum === 1 && (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square animate-pulse rounded-2xl bg-slate-100" />
              ))}
            </div>
          )}

          {!isLoading && accumulated.length === 0 && (
            <p className="py-16 text-center text-slate-400">Bu kategoriyada mahsulotlar topilmadi.</p>
          )}

          {accumulated.length > 0 && (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
              {accumulated.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {hasMore && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => setPageNum((p) => p + 1)}
                disabled={isFetching}
                className="rounded-full border border-[var(--rt-brand-primary)] px-6 py-3 text-sm font-semibold text-[var(--rt-brand-primary)] transition-colors hover:bg-[var(--rt-brand-primary)] hover:text-white disabled:opacity-50"
              >
                {isFetching ? "Yuklanmoqda..." : "Yana yuklash"}
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
