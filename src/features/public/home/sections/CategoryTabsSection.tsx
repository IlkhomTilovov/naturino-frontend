import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { productCategoriesApi } from "../../../../api/endpoints/products";
import { useLanguage } from "../../../../i18n/LanguageContext";

const TAB_TEXT: Record<string, { ingredients: string; forDogs: string; forCats: string; forBreeders: string; whereToBuy: string; nav: string }> = {
  uz: { ingredients: "Ingredientlar", forDogs: "Itlar uchun", forCats: "Mushuklar uchun", forBreeders: "Zavodchilarga", whereToBuy: "Qayerdan sotib olish", nav: "Kategoriya bo'limlari" },
  ru: { ingredients: "Ингредиенты", forDogs: "Для собак", forCats: "Для кошек", forBreeders: "Заводчикам", whereToBuy: "Где купить", nav: "Разделы категории" },
  en: { ingredients: "Ingredients", forDogs: "For Dogs", forCats: "For Cats", forBreeders: "For Breeders", whereToBuy: "Where to Buy", nav: "Category sections" },
};

// Pure navigation bar — each tab is a real route (/categories/:slug or
// /categories/:slug/:tab), not client-side state. Ingredientlar, Zavodchilarga
// and Qayerdan sotib olish always show; the species tabs (Itlar/Mushuklar
// uchun) show independently of each other based on whether that Toifa
// actually has an "it-<slug>" and/or "mushuk-<slug>" Sub-toifa — a Toifa with
// both species (e.g. "Quruq ozuqa") gets both tabs, not just one guessed
// from the slug text the way this used to work. Zavodchilarga and Qayerdan
// sotib olish are the two exceptions to the "tab = category route" rule —
// they point at the About Us and Contact pages respectively, not a Sub-toifa.
export function CategoryTabsSection({
  categorySlug: categorySlugProp,
  activeTab: activeTabProp,
}: { categorySlug?: string; activeTab?: string } = {}) {
  const { language } = useLanguage();
  const t = TAB_TEXT[language] ?? TAB_TEXT.uz;
  const params = useParams<{ slug?: string; tab?: string }>();
  // Optional props let a page outside /categories/:slug(/:tab) — e.g. a
  // product reached from within a category — reuse this same tab bar by
  // passing the category context explicitly instead of relying on the URL.
  const categorySlug = categorySlugProp ?? params.slug;
  const activeTab = activeTabProp ?? params.tab;
  const { data: categories } = useQuery({ queryKey: ["product-categories", "public"], queryFn: productCategoriesApi.getAll });

  if (!categorySlug) return null;

  const subCategorySlugs = new Set((categories ?? []).map((c) => c.slug));
  const showDogTab = subCategorySlugs.has(`it-${categorySlug}`);
  const showCatTab = subCategorySlugs.has(`mushuk-${categorySlug}`);

  type Tab = { label: string; slug?: string; to?: string };
  const tabs: Tab[] = (
    [
      { label: t.ingredients, slug: "" },
      showDogTab && { label: t.forDogs, slug: "itlar-uchun" },
      showCatTab && { label: t.forCats, slug: "mushuklar-uchun" },
      { label: t.forBreeders, to: `/about-us?fromCategory=${categorySlug}&fromTab=${activeTab ?? ""}` },
      { label: t.whereToBuy, to: `/contact?fromCategory=${categorySlug}&fromTab=${activeTab ?? ""}` },
    ] as (Tab | false)[]
  ).filter((t): t is Tab => Boolean(t));

  return (
    <div className="sticky top-[68px] z-40 w-full border-b border-[#E7EBDD] bg-white/95 backdrop-blur-md">
      <nav
        aria-label={t.nav}
        className="mx-auto flex h-14 max-w-[1400px] items-center justify-start gap-1 overflow-x-auto px-4 sm:justify-end sm:px-6"
      >
        {tabs.map((tab, i) => {
          const tabSlug = tab.slug?.trim();
          const to = tab.to ?? (tabSlug ? `/categories/${categorySlug}/${tabSlug}` : `/categories/${categorySlug}`);
          const isActive = !tab.to && (activeTab ?? "") === (tabSlug ?? "");
          return (
            <Link
              key={i}
              to={to}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--rt-brand-primary)] ${
                isActive
                  ? "bg-[#EFF2E9] text-[var(--rt-brand-primary)]"
                  : "text-[#294A34]/70 hover:bg-[#EFF2E9] hover:text-[var(--rt-brand-primary)]"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
