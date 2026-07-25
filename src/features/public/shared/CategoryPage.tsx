import { useParams } from "react-router-dom";
import { DynamicPage } from "./DynamicPage";

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  return <DynamicPage slug={slug ?? ""} fallbackTitle="Kategoriya" />;
}
