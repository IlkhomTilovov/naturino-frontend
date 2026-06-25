import { InlineText } from "./InlineText";
import { DragHandleIcon, PlusIcon, TrashIcon } from "../icons";

interface IconCard {
  icon?: string;
  title?: string;
  description?: string;
}

export function InlineIconCardGrid({
  cards,
  onChange,
  iconHint,
  gridClassName = "mt-10 grid gap-5 sm:grid-cols-2",
}: {
  cards: IconCard[];
  onChange: (cards: IconCard[]) => void;
  iconHint?: string;
  gridClassName?: string;
}) {
  const update = (i: number, patch: Partial<IconCard>) => onChange(cards.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));
  const remove = (i: number) => onChange(cards.filter((_, idx) => idx !== i));
  const add = () => onChange([...cards, { icon: "globe", title: "Yangi karta", description: "" }]);

  const handleDrop = (from: number, to: number) => {
    if (from === to) return;
    const next = [...cards];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  };

  return (
    <div className={gridClassName}>
      {cards.map((card, i) => (
        <div
          key={i}
          draggable
          onDragStart={(e) => e.dataTransfer.setData("text/plain", String(i))}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(Number(e.dataTransfer.getData("text/plain")), i)}
          className="group relative rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm"
        >
          <div className="invisible absolute right-2 top-2 flex items-center gap-1 group-hover:visible">
            <span className="flex h-5 w-5 cursor-grab items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <DragHandleIcon className="h-3 w-3" />
            </span>
            <button type="button" onClick={(e) => { e.stopPropagation(); remove(i); }} className="flex h-5 w-5 items-center justify-center rounded-full bg-admin-danger text-white">
              <TrashIcon className="h-2.5 w-2.5" />
            </button>
          </div>

          <InlineText
            value={card.icon}
            placeholder={iconHint ?? "ikon"}
            onCommit={(v) => update(i, { icon: v })}
            className="text-[10px] font-semibold uppercase tracking-wide text-admin-muted"
          />
          <h3 className="mt-2 font-semibold text-slate-900">
            <InlineText value={card.title} placeholder="Sarlavha" onCommit={(v) => update(i, { title: v })} />
          </h3>
          <InlineText
            value={card.description}
            placeholder="Tavsif"
            multiline
            onCommit={(v) => update(i, { description: v })}
            className="mt-1.5 block text-sm leading-relaxed text-slate-500"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="flex min-h-[8rem] items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-slate-300 text-sm font-medium text-admin-muted hover:border-admin-primary hover:text-admin-primary"
      >
        <PlusIcon className="h-3.5 w-3.5" /> Karta qo'shish
      </button>
    </div>
  );
}
