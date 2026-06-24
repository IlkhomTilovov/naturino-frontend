import { useState } from "react";
import { InlineText } from "./InlineText";
import { DragHandleIcon, PlusIcon, TrashIcon } from "../icons";

export function InlineChecklist({ items, onChange }: { items: string[]; onChange: (items: string[]) => void }) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const update = (index: number, value: string) => onChange(items.map((it, i) => (i === index ? value : it)));
  const remove = (index: number) => onChange(items.filter((_, i) => i !== index));
  const add = () => onChange([...items, "Yangi band"]);

  const handleDrop = (target: number) => {
    if (draggedIndex === null || draggedIndex === target) return;
    const next = [...items];
    const [moved] = next.splice(draggedIndex, 1);
    next.splice(target, 0, moved);
    onChange(next);
    setDraggedIndex(null);
  };

  return (
    <>
      {items.map((item, index) => (
        <li
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
          className={`group flex items-start gap-2 text-sm text-slate-600 ${draggedIndex === index ? "opacity-40" : ""}`}
        >
          <span className="mt-0.5 cursor-grab text-slate-300 group-hover:text-admin-muted">
            <DragHandleIcon className="h-3.5 w-3.5" />
          </span>
          <span className="mt-0.5 text-brand-600">✓</span>
          <InlineText value={item} placeholder="Band matni" onCommit={(v) => update(index, v)} className="flex-1" />
          <button
            type="button"
            title="O'chirish"
            onClick={(e) => {
              e.stopPropagation();
              remove(index);
            }}
            className="invisible flex h-5 w-5 items-center justify-center rounded-full text-admin-muted hover:bg-admin-danger-50 hover:text-admin-danger group-hover:visible"
          >
            <TrashIcon className="h-3 w-3" />
          </button>
        </li>
      ))}
      <li>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            add();
          }}
          className="flex items-center gap-1 rounded-md border border-dashed border-slate-300 px-2 py-1.5 text-xs font-medium text-admin-muted transition-colors hover:border-admin-primary hover:text-admin-primary"
        >
          <PlusIcon className="h-3 w-3" /> Band qo'shish
        </button>
      </li>
    </>
  );
}
