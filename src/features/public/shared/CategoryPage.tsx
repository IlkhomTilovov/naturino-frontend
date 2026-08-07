import { useParams } from "react-router-dom";
import { DynamicPage } from "./DynamicPage";
import { CategoryTabsSection } from "../home/sections/CategoryTabsSection";

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  return (
    <>
      <CategoryTabsSection />
      <DynamicPage slug={slug ?? ""} fallbackTitle="Kategoriya" />
    </>
  );
}
