import { InlineText } from "../../../components/admin/inline/InlineText";
import { DragHandleIcon, PlusIcon, TrashIcon } from "../../../components/admin/icons";
import type { PageSectionContent } from "../../../types/page";

interface FaqItem {
  question?: string;
  answer?: string;
}

export function EditableFaqSection({
  content,
  onFieldChange,
}: {
  content: PageSectionContent;
  onFieldChange: (key: string, value: unknown) => void;
}) {
  const eyebrow = content.eyebrow as string | undefined;
  const title = content.title as string | undefined;
  const items = (content.items as FaqItem[] | undefined) ?? [];

  const updateItem = (i: number, patch: Partial<FaqItem>) => onFieldChange("items", items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  const removeItem = (i: number) => onFieldChange("items", items.filter((_, idx) => idx !== i));
  const addItem = () => onFieldChange("items", [...items, { question: "Yangi savol", answer: "" }]);

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <div className="text-center">
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

      <div className="mt-10 divide-y divide-slate-200 rounded-2xl border border-slate-200">
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
            className="group relative px-6 py-4"
          >
            <div className="invisible absolute right-2 top-2 flex items-center gap-1 group-hover:visible">
              <span className="flex h-5 w-5 cursor-grab items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <DragHandleIcon className="h-3 w-3" />
              </span>
              <button type="button" onClick={(e) => { e.stopPropagation(); removeItem(i); }} className="flex h-5 w-5 items-center justify-center rounded-full bg-admin-danger text-white">
                <TrashIcon className="h-2.5 w-2.5" />
              </button>
            </div>
            <InlineText value={item.question} placeholder="Savol" onCommit={(v) => updateItem(i, { question: v })} className="block pr-12 font-medium text-slate-900" />
            <InlineText value={item.answer} placeholder="Javob" multiline onCommit={(v) => updateItem(i, { answer: v })} className="mt-1.5 block text-sm text-slate-500" />
          </div>
        ))}
        <div className="px-6 py-4">
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-1.5 text-sm font-medium text-admin-muted hover:text-admin-primary"
          >
            <PlusIcon className="h-3.5 w-3.5" /> Savol qo'shish
          </button>
        </div>
      </div>
    </section>
  );
}
