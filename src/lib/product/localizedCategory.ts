import type { ProductCategory } from "../../types/product";

type TextField = "name" | "description";

/** Resolves a ProductCategory's text field for the given site language, mirroring localizedProductField. */
export function localizedCategoryField(category: ProductCategory, lang: string, field: TextField): string | null | undefined {
  if (lang === "uz") return category[field];
  const override = category.translations?.[lang]?.[field];
  return override && override.trim() !== "" ? override : category[field];
}
