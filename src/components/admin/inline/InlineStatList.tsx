import { useState } from "react";
import { InlineText } from "./InlineText";
import { DragHandleIcon, PlusIcon, TrashIcon } from "../icons";

interface Stat {
  value?: string;
  label?: string;
}

export function InlineStatList({
  items,
  onChange,
  itemClassName,
  valueClassName,
  labelClassName,
}: {
  items: Stat[];
  onChange: (items: Stat[]) => void;
  itemClassName?: string;
  valueClassName?: string;
  labelClassName?: string;
}) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const update = (index: number, patch: Partial<Stat>) => onChange(items.map((it, i) => (i === index ? { ...it, ...patch } : it)));
  const remove = (index: number) => onChange(items.filter((_, i) => i !== index));
  const add = () => onChange([...items, { value: "0", label: "Yangi band" }]);

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
          className={`group relative ${itemClassName ?? ""} ${draggedIndex === index ? "opacity-40" : ""}`}
        >
          <div className="invisible absolute -right-1.5 -top-1.5 z-10 flex items-center gap-1 group-hover:visible">
            <span className="flex h-5 w-5 cursor-grab items-center justify-center rounded-full bg-white/90 text-slate-500 shadow-sm">
              <DragHandleIcon className="h-3 w-3" />
            </span>
            <button
              type="button"
              title="O'chirish"
              onClick={(e) => {
                e.stopPropagation();
                remove(index);
              }}
              className="flex h-5 w-5 items-center justify-center rounded-full bg-admin-danger text-white shadow-sm ring-1 ring-white hover:bg-red-600"
            >
              <TrashIcon className="h-2.5 w-2.5" />
            </button>
          </div>
          <InlineText
            value={item.value}
            placeholder="Qiymat"
            onCommit={(v) => update(index, { value: v })}
            className={valueClassName}
          />
          <InlineText
            value={item.label}
            placeholder="Yorlik"
            onCommit={(v) => update(index, { label: v })}
            className={labelClassName}
            tag="div"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          add();
        }}
        className="flex h-fit items-center gap-1 self-center rounded-md border border-dashed border-white/40 px-2 py-1.5 text-xs font-medium text-white/70 transition-colors hover:border-white hover:text-white"
      >
        <PlusIcon className="h-3 w-3" /> Qo'shish
      </button>
    </>
  );
}
