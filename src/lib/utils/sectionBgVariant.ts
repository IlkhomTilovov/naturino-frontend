export type BgVariant = "default" | "cream" | "dark";

// Shared "which of our two brand backgrounds does this section sit on"
// helper — lets a section alternate between the cream and forest-green
// brand surfaces (admin-configurable per section) without hardcoding one
// look, while keeping every section's text/eyebrow/body colors legible on
// whichever surface is picked.
export function bgVariantClasses(variant: string | undefined, defaultSectionClass: string) {
  const isDark = variant === "dark";
  const isCream = variant === "cream";
  return {
    section: isDark ? "bg-[var(--rt-brand-primary)]" : isCream ? "bg-[#F3EDE1]" : defaultSectionClass,
    isDark,
    heading: isDark ? "text-white" : "text-[#294A34]",
    body: isDark ? "text-white/70" : "text-taupe",
    eyebrow: isDark ? "text-[var(--rt-accent)]" : "text-[var(--rt-brand-secondary)]",
    card: isDark ? "bg-white/[0.06] border-white/10" : "bg-black/[0.03] border-black/5",
    cardValue: isDark ? "text-white" : "text-[#294A34]",
    cardLabel: isDark ? "text-white/60" : "text-taupe",
  };
}

export const BG_VARIANT_FIELD = {
  key: "bgVariant",
  label: "Fon rangi",
  type: "select" as const,
  options: [
    { value: "default", label: "Standart" },
    { value: "cream", label: "Krem" },
    { value: "dark", label: "To'q yashil" },
  ],
};
