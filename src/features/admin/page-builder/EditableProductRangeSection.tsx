import { InlineText } from "../../../components/admin/inline/InlineText";
import { InlineChecklist } from "../../../components/admin/inline/InlineChecklist";
import type { PageSectionContent } from "../../../types/page";

export function EditableProductRangeSection({
  content,
  onFieldChange,
}: {
  content: PageSectionContent;
  onFieldChange: (key: string, value: unknown) => void;
}) {
  const eyebrow = content.eyebrow as string | undefined;
  const title = content.title as string | undefined;
  const subtitle = content.subtitle as string | undefined;
  const categorySlugs = (content.categorySlugs as string[] | undefined) ?? [];

  return (
    <section className="bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <InlineText
            value={eyebrow}
            placeholder="Eyebrow matni"
            onCommit={(v) => onFieldChange("eyebrow", v)}
            className="text-xs font-semibold uppercase tracking-wide text-[var(--rt-brand-primary)]"
          />
          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            <InlineText value={title} placeholder="Sarlavha" onCommit={(v) => onFieldChange("title", v)} />
          </h2>
          <InlineText value={subtitle} placeholder="Matn" multiline onCommit={(v) => onFieldChange("subtitle", v)} className="mt-3 block text-slate-500" />
        </div>

        <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-dashed border-slate-300 bg-white p-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-admin-muted">
            Ko'rsatiladigan toifalar (slug) — bo'sh qoldirilsa barchasi ko'rsatiladi
          </p>
          <ul className="flex flex-wrap gap-2">
            <InlineChecklist items={categorySlugs} onChange={(v) => onFieldChange("categorySlugs", v)} />
          </ul>
        </div>

        <p className="mt-6 text-center text-sm text-admin-muted">Toifa kartalari haqiqiy mahsulot kategoriyalaridan olinadi.</p>
      </div>
    </section>
  );
}
