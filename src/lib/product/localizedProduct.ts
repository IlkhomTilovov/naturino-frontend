import type { Product } from "../../types/product";

type TextField = "name" | "shortDescription" | "description";

/** Resolves a Product's text field for the given site language. "uz" is always the base
 * (default-language) column; other languages fall back to it when no translation override exists. */
export function localizedProductField(product: Product, lang: string, field: TextField): string | null | undefined {
  if (lang === "uz") return product[field];
  const override = product.translations?.[lang]?.[field];
  return override && override.trim() !== "" ? override : product[field];
}
