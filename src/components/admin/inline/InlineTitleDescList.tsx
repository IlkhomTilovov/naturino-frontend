import { useState } from "react";
import { InlineText } from "./InlineText";
import { InlineImage } from "./InlineImage";
import { DragHandleIcon, PlusIcon, TrashIcon } from "../icons";

interface Item {
  title?: string;
  description?: string;
  imageUrl?: string;
}

// Shared repeater for the "title + description(+ optional image)" shape used
// by several of the Jarayon step lists — a lighter sibling of
// InlineIconCardGrid for cases that don't need an icon field.
export function InlineTitleDescList({
  items,
  onChange,
  showImage = false,
  gridClassName = "mt-6 space-y-3",
  itemClassName = "group relative rounded-xl border border-slate-200 bg-white p-4",
}: {
  items: Item[];
  onChange: (items: Item[]) => void;
  showImage?: boolean;
  gridClassName?: string;
  itemClassName?: string;
}) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const update = (index: number, patch: Partial<Item>) => onChange(items.map((it, i) => (i === index ? { ...it, ...patch } : it)));
  const remove = (index: number) => onChange(items.filter((_, i) => i !== index));
  const add = () => onChange([...items, { title: "Yangi bosqich", description: "" }]);

  const handleDrop = (target: number) => {
    if (draggedIndex === null || draggedIndex === target) return;
    const next = [...items];
    const [moved] = next.splice(draggedIndex, 1);
    next.splice(target, 0, moved);
    onChange(next);
    setDraggedIndex(null);
  };

  return (
    <div className={gridClassName}>
      {items.map((item, index) => (
        <div
          key={index}
          draggable
          onDragStart={(e) => {
            e.stopPropagation();
            setDraggedIndex(index);
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.stopPropagation();
            handleDrop(index);
          }}
          className={`${itemClassName} ${draggedIndex === index ? "opacity-40" : ""}`}
        >
          <div className="invisible absolute right-2 top-2 z-10 flex items-center gap-1 group-hover:visible">
            <span className="flex h-5 w-5 cursor-grab items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <DragHandleIcon className="h-3 w-3" />
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                remove(index);
              }}
              className="flex h-5 w-5 items-center justify-center rounded-full bg-admin-danger text-white"
            >
              <TrashIcon className="h-2.5 w-2.5" />
            </button>
          </div>

          {showImage && (
            <InlineImage
              imageUrl={item.imageUrl}
              alt={item.title}
              className="mb-2 block h-24 w-full rounded-lg object-cover"
              onChange={(url) => update(index, { imageUrl: url ?? undefined })}
            />
          )}
          <p className="font-semibold text-slate-900">
            <InlineText value={item.title} placeholder="Sarlavha" onCommit={(v) => update(index, { title: v })} />
          </p>
          <InlineText
            value={item.description}
            placeholder="Tavsif"
            multiline
            onCommit={(v) => update(index, { description: v })}
            className="mt-1 block text-sm leading-relaxed text-slate-500"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-300 py-2.5 text-sm font-medium text-admin-muted hover:border-admin-primary hover:text-admin-primary"
      >
        <PlusIcon className="h-3.5 w-3.5" /> Bosqich qo'shish
      </button>
    </div>
  );
}
