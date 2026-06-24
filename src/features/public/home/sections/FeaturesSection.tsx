import type { PageSectionContent } from "../../../../types/page";

export function FeaturesSection({ content }: { content: PageSectionContent }) {
  const eyebrow = content.eyebrow as string | undefined;
  const title = content.title as string | undefined;
  const subtitle = content.subtitle as string | undefined;

  if (!title && !subtitle) return null;

  return (
    <section className="mx-auto max-w-3xl px-6 py-16 text-center">
      {eyebrow && <p className="text-xs font-semibold uppercase tracking-wide text-[var(--rt-brand-primary)]">{eyebrow}</p>}
      {title && <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">{title}</h2>}
      {subtitle && <p className="mt-5 text-slate-600">{subtitle}</p>}
    </section>
  );
}
