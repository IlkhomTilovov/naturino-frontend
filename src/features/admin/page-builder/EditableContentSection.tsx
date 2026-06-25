import { InlineText } from "../../../components/admin/inline/InlineText";
import { InlineImage } from "../../../components/admin/inline/InlineImage";
import { DragHandleIcon, PlusIcon, TrashIcon } from "../../../components/admin/icons";
import type { PageSectionContent } from "../../../types/page";

interface CertificateItem {
  imageUrl?: string;
  name?: string;
}

export function EditableContentSection({
  content,
  onFieldChange,
}: {
  content: PageSectionContent;
  onFieldChange: (key: string, value: unknown) => void;
}) {
  const title = content.title as string | undefined;
  const subtitle = content.subtitle as string | undefined;
  const body = content.content as string | undefined;
  const buttonText = content.buttonText as string | undefined;
  const buttonUrl = content.buttonUrl as string | undefined;
  const imageUrl = content.imageUrl as string | undefined;
  const items = (content.items as CertificateItem[] | undefined) ?? [];

  const updateItem = (i: number, patch: Partial<CertificateItem>) => onFieldChange("items", items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  const removeItem = (i: number) => onFieldChange("items", items.filter((_, idx) => idx !== i));
  const addItem = () => onFieldChange("items", [...items, { name: "Yangi" }]);

  return (
    <section className="mx-auto max-w-4xl px-6 py-16 text-center">
      <h2 className="text-3xl font-bold text-slate-900">
        <InlineText value={title} placeholder="Sarlavha" onCommit={(v) => onFieldChange("title", v)} />
      </h2>
      <InlineText
        value={subtitle}
        placeholder="Kichik sarlavha"
        onCommit={(v) => onFieldChange("subtitle", v)}
        className="mt-2 block text-lg text-slate-500"
      />

      <div className="mx-auto mt-6 max-h-80 w-full max-w-md">
        <InlineImage imageUrl={imageUrl} alt={title} className="mx-auto max-h-80 w-full max-w-md object-contain" onChange={(url) => onFieldChange("imageUrl", url)} />
      </div>

      <InlineText
        value={body}
        placeholder="Matn"
        multiline
        onCommit={(v) => onFieldChange("content", v)}
        className="mx-auto mt-6 block whitespace-pre-line text-slate-600"
      />

      <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
        {items.map((item, i) => (
          <div
            key={i}
            draggable
            onDragStart={(e) => e.dataTransfer.setData("text/plain", String(i))}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const from = Number(e.dataTransfer.getData("text/plain"));
              if (from === i) return;
              const next = [...items];
              const [moved] = next.splice(from, 1);
              next.splice(i, 0, moved);
              onFieldChange("items", next);
            }}
            className="group relative rounded-2xl border border-slate-200 bg-white p-4"
          >
            <div className="invisible absolute right-1 top-1 flex items-center gap-1 group-hover:visible">
              <span className="flex h-5 w-5 cursor-grab items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <DragHandleIcon className="h-3 w-3" />
              </span>
              <button type="button" onClick={(e) => { e.stopPropagation(); removeItem(i); }} className="flex h-5 w-5 items-center justify-center rounded-full bg-admin-danger text-white">
                <TrashIcon className="h-2.5 w-2.5" />
              </button>
            </div>
            <InlineImage imageUrl={item.imageUrl} alt={item.name} className="aspect-square w-full rounded-lg object-contain" onChange={(url) => updateItem(i, { imageUrl: url ?? undefined })} />
            <InlineText value={item.name} placeholder="Nomi" onCommit={(v) => updateItem(i, { name: v })} className="mt-3 block text-sm font-medium text-slate-700" />
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="flex min-h-[8rem] items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-slate-300 text-sm font-medium text-admin-muted hover:border-admin-primary hover:text-admin-primary"
        >
          <PlusIcon className="h-3.5 w-3.5" /> Qo'shish
        </button>
      </div>

      <div className="mt-6 inline-flex items-center rounded-full bg-[var(--rt-brand-primary)] px-6 py-3 font-semibold text-white">
        <InlineText value={buttonText} placeholder="Tugma matni" onCommit={(v) => onFieldChange("buttonText", v)} />
      </div>
      <InlineText
        value={buttonUrl}
        placeholder="/"
        onCommit={(v) => onFieldChange("buttonUrl", v)}
        className="ml-3 inline-block rounded border border-admin-border bg-white px-2 py-1 text-xs text-admin-muted"
      />
    </section>
  );
}
