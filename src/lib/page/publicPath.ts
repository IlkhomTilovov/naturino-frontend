// A page's CMS slug doesn't always match its public URL path (see routes/AppRoutes.tsx) —
// this maps the known exceptions so admin "Ko'rish" links open the real route.
const SLUG_PATH_OVERRIDES: Record<string, string> = {
  production: "ishlab-chiqarish",
};

export function publicPathForSlug(slug: string): string {
  if (!slug) return "/";
  return `/${SLUG_PATH_OVERRIDES[slug] ?? slug}`;
}

/** Reverse of the above, scoped to the routes that are actually CMS page-builder driven
 * (i.e. rendered via renderSection over page.sections) — used to keep in-site navigation
 * inside live-edit mode. Routes like /products or /contact use hand-built components, not
 * page.sections, so they're intentionally excluded — visiting them exits live-edit. */
export const ROUTE_TO_SLUG: Record<string, string> = {
  "/": "",
  "/about-us": "about-us",
  "/ishlab-chiqarish": "production",
  "/certificates": "certificates",
  "/quality": "quality",
  "/partnership": "partnership",
  "/blog": "blog",
};
