import { InlineText } from "../../../components/admin/inline/InlineText";
import { InlineImage } from "../../../components/admin/inline/InlineImage";
import { DragHandleIcon, PlusIcon, TrashIcon } from "../../../components/admin/icons";
import type { PageSectionContent } from "../../../types/page";

interface GalleryImage {
  imageUrl?: string;
  category?: string;
  caption?: string;
}

export function EditableGallerySection({
  content,
  onFieldChange,
}: {
  content: PageSectionContent;
  onFieldChange: (key: string, value: unknown) => void;
}) {
  const eyebrow = content.eyebrow as string | undefined;
  const title = content.title as string | undefined;
  const images = (content.images as GalleryImage[] | undefined) ?? [];

  const updateImage = (i: number, patch: Partial<GalleryImage>) => onFieldChange("images", images.map((img, idx) => (idx === i ? { ...img, ...patch } : img)));
  const removeImage = (i: number) => onFieldChange("images", images.filter((_, idx) => idx !== i));
  const addImage = () => onFieldChange("images", [...images, { category: "", caption: "" }]);

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
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
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, i) => (
          <div
            key={i}
            draggable
            onDragStart={(e) => e.dataTransfer.setData("text/plain", String(i))}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const from = Number(e.dataTransfer.getData("text/plain"));
              if (from === i) return;
              const next = [...images];
              const [moved] = next.splice(from, 1);
              next.splice(i, 0, moved);
              onFieldChange("images", next);
            }}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm"
          >
            <div className="invisible absolute right-2 top-2 z-10 flex items-center gap-1 group-hover:visible">
              <span className="flex h-5 w-5 cursor-grab items-center justify-center rounded-full bg-white/90 text-slate-500">
                <DragHandleIcon className="h-3 w-3" />
              </span>
              <button type="button" onClick={(e) => { e.stopPropagation(); removeImage(i); }} className="flex h-5 w-5 items-center justify-center rounded-full bg-admin-danger text-white">
                <TrashIcon className="h-2.5 w-2.5" />
              </button>
            </div>
            <InlineImage imageUrl={image.imageUrl} alt={image.caption} className="aspect-[4/3] w-full object-cover" onChange={(url) => updateImage(i, { imageUrl: url ?? undefined })} />
            <div className="px-4 py-3">
              <InlineText value={image.category} placeholder="Toifa" onCommit={(v) => updateImage(i, { category: v })} className="block text-xs font-semibold uppercase tracking-wide text-admin-muted" />
              <InlineText value={image.caption} placeholder="Izoh" onCommit={(v) => updateImage(i, { caption: v })} className="mt-1 block text-sm font-medium text-slate-600" />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addImage}
          className="flex min-h-[12rem] items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-slate-300 text-sm font-medium text-admin-muted hover:border-admin-primary hover:text-admin-primary"
        >
          <PlusIcon className="h-3.5 w-3.5" /> Rasm qo'shish
        </button>
      </div>
    </section>
  );
}
