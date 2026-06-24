import { MediaUploaderField } from "./MediaUploaderField";

export interface RepeaterFieldDef {
  key: string;
  label: string;
  type?: "text" | "textarea" | "image";
}

export function RepeaterEditor({
  items,
  fields,
  onChange,
  addLabel = "Qator qo'shish",
  emptyItem,
}: {
  items: Record<string, unknown>[];
  fields: RepeaterFieldDef[];
  onChange: (items: Record<string, unknown>[]) => void;
  addLabel?: string;
  emptyItem?: Record<string, unknown>;
}) {
  const update = (index: number, key: string, value: unknown) => {
    const next = items.map((item, i) => (i === index ? { ...item, [key]: value } : item));
    onChange(next);
  };

  const remove = (index: number) => onChange(items.filter((_, i) => i !== index));

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const add = () => onChange([...items, emptyItem ?? Object.fromEntries(fields.map((f) => [f.key, ""]))]);

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="rounded-lg border border-admin-border p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-admin-muted">#{index + 1}</span>
            <div className="flex items-center gap-1">
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
              <button type="button" onClick={() => remove(index)} className="px-1 text-admin-danger hover:text-admin-danger">
                ✕
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {fields.map((field) => (
              <div key={field.key} className={field.type === "textarea" || field.type === "image" ? "col-span-2" : ""}>
                <label className="mb-1 block text-xs font-medium text-admin-muted">{field.label}</label>
                {field.type === "textarea" ? (
                  <textarea
                    className="input"
                    rows={2}
                    value={(item[field.key] as string) ?? ""}
                    onChange={(e) => update(index, field.key, e.target.value)}
                  />
                ) : field.type === "image" ? (
                  <MediaUploaderField imageUrl={item[field.key] as string | undefined} onChange={(url) => update(index, field.key, url ?? "")} />
                ) : (
                  <input
                    className="input"
                    value={(item[field.key] as string) ?? ""}
                    onChange={(e) => update(index, field.key, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
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
