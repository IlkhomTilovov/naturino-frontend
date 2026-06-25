import { InlineText } from "../../../components/admin/inline/InlineText";
import type { PageSectionContent } from "../../../types/page";

export function EditableProductsSection({
  content,
  onFieldChange,
}: {
  content: PageSectionContent;
  onFieldChange: (key: string, value: unknown) => void;
}) {
  const eyebrow = content.eyebrow as string | undefined;
  const title = content.title as string | undefined;
  const subtitle = content.subtitle as string | undefined;
  const buttonText = content.buttonText as string | undefined;
  const buttonUrl = content.buttonUrl as string | undefined;

  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24" style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #F8FAF5 100%)" }}>
      <div className="mx-auto max-w-6xl text-center">
        <InlineText
          value={eyebrow}
          placeholder="MAHSULOTLARIMIZ"
          onCommit={(v) => onFieldChange("eyebrow", v)}
          className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--rt-brand-primary)]"
        />
        <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
          <InlineText value={title} placeholder="Sarlavha" onCommit={(v) => onFieldChange("title", v)} />
        </h2>
        <InlineText
          value={subtitle}
          placeholder="Matn"
          multiline
          onCommit={(v) => onFieldChange("subtitle", v)}
          className="mx-auto mt-3 block max-w-2xl text-slate-500"
        />

        <div className="mt-12 rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-10 text-sm text-admin-muted">
          Mahsulotlar karuseli — chiqishi haqiqiy mahsulotlar ma'lumotlaridan olinadi (oldindan ko'rib bo'lmaydi).
        </div>

        <div className="mt-8 flex items-center justify-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--rt-accent)] px-6 py-3 font-semibold text-slate-900">
            <InlineText value={buttonText} placeholder="Tugma matni" onCommit={(v) => onFieldChange("buttonText", v)} />
          </div>
          <InlineText
            value={buttonUrl}
            placeholder="/products"
            onCommit={(v) => onFieldChange("buttonUrl", v)}
            className="rounded border border-admin-border bg-white px-2 py-1 text-xs text-admin-muted"
          />
        </div>
      </div>
    </section>
  );
}
