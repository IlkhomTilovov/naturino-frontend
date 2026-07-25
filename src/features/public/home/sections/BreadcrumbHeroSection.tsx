import type { PageSectionContent } from "../../../../types/page";

// Dark gradient bar with a breadcrumb + centered title — matches the style
// already hand-built into ProductsPage, but reusable/admin-editable on any page.
export function BreadcrumbHeroSection({ content }: { content: PageSectionContent }) {
  const breadcrumbHome = (content.breadcrumbHome as string | undefined) || "Bosh sahifa";
  const breadcrumbCurrent = content.breadcrumbCurrent as string | undefined;
  const title = content.title as string | undefined;
  const subtitle = content.subtitle as string | undefined;

  if (!breadcrumbCurrent && !title && !subtitle) return null;

  return (
    <section className="relative overflow-hidden bg-[var(--rt-brand-primary)] px-6 pb-14 pt-16 text-center text-white sm:pb-16 sm:pt-20">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--rt-accent) 12%, transparent) 0%, transparent 55%), radial-gradient(circle at 100% 100%, color-mix(in srgb, var(--rt-brand-secondary) 25%, transparent) 0%, transparent 55%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-3xl">
        {breadcrumbCurrent && (
          <p className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--rt-accent)]">
            <span className="text-white/50">{breadcrumbHome}</span>
            <span aria-hidden className="text-white/30">/</span>
            {breadcrumbCurrent.toLocaleUpperCase("uz")}
          </p>
        )}
        {title && <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">{title}</h1>}
        {subtitle && <p className="mx-auto mt-4 max-w-xl text-white/70">{subtitle}</p>}
      </div>
    </section>
  );
}
