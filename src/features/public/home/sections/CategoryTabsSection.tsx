import { Link, useParams } from "react-router-dom";
import type { PageSectionContent } from "../../../../types/page";

interface CategoryTabItem {
  label?: string;
  slug?: string;
}

// Pure navigation bar — each tab is a real route (/categories/:slug or
// /categories/:slug/:tab), not client-side state. This lets the same section
// be added to every page in a category's tab group so the bar (and its active
// highlight) stays visible while browsing between tabs.
export function CategoryTabsSection({ content }: { content: PageSectionContent }) {
  const { slug: categorySlug, tab: activeTab } = useParams<{ slug: string; tab?: string }>();
  const tabs = ((content.tabs as CategoryTabItem[] | undefined) ?? []).filter((t) => t.label);

  if (tabs.length === 0 || !categorySlug) return null;

  return (
    <div className="sticky top-[68px] z-40 w-full border-b border-[#E7EBDD] bg-white/95 backdrop-blur-md">
      <nav
        aria-label="Kategoriya bo'limlari"
        className="mx-auto flex h-14 max-w-[1400px] items-center justify-end gap-1 overflow-x-auto px-4 sm:px-6"
      >
        {tabs.map((tab, i) => {
          const tabSlug = tab.slug?.trim();
          const to = tabSlug ? `/categories/${categorySlug}/${tabSlug}` : `/categories/${categorySlug}`;
          const isActive = (activeTab ?? "") === (tabSlug ?? "");
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
