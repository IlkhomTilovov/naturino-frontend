export function StringListEditor({
  items,
  onChange,
  addLabel = "Band qo'shish",
  placeholder,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  addLabel?: string;
  placeholder?: string;
}) {
  const update = (index: number, value: string) => onChange(items.map((item, i) => (i === index ? value : item)));
  const remove = (index: number) => onChange(items.filter((_, i) => i !== index));
  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };
  const add = () => onChange([...items, ""]);

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <input className="input flex-1" value={item} placeholder={placeholder} onChange={(e) => update(index, e.target.value)} />
          <button type="button" onClick={() => move(index, -1)} disabled={index === 0} className="px-1 text-admin-muted hover:text-admin-primary disabled:opacity-30">
            ↑
          </button>
          <button
            type="button"
            onClick={() => move(index, 1)}
            disabled={index === items.length - 1}
            className="px-1 text-admin-muted hover:text-admin-primary disabled:opacity-30"
          >
            ↓
          </button>
          <button type="button" onClick={() => remove(index)} className="px-1 text-admin-danger">
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="w-full rounded-lg border border-dashed border-admin-border py-2 text-sm font-medium text-admin-muted hover:border-admin-primary hover:text-admin-primary"
      >
        + {addLabel}
      </button>
    </div>
  );
}
