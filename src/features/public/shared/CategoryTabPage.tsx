import { useParams } from "react-router-dom";
import { DynamicPage } from "./DynamicPage";
import { CategoryTabProducts } from "./CategoryTabProducts";

const PRODUCT_TABS = new Set(["itlar-uchun", "mushuklar-uchun"]);

export function CategoryTabPage() {
  const { slug, tab } = useParams<{ slug: string; tab: string }>();
  const combinedSlug = slug && tab ? `${slug}-${tab}` : "";

  return (
    <>
      <DynamicPage slug={combinedSlug} fallbackTitle="Kategoriya bo'limi" />
      {slug && tab && PRODUCT_TABS.has(tab) && <CategoryTabProducts categorySlug={slug} />}
    </>
  );
}
