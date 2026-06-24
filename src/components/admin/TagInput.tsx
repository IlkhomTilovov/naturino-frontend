import { useState } from "react";

export function TagInput({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
  const tags = value
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const [draft, setDraft] = useState("");

  const addTag = () => {
    const tag = draft.trim();
    if (!tag || tags.includes(tag)) {
      setDraft("");
      return;
    }
    onChange([...tags, tag].join(", "));
    setDraft("");
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag).join(", "));
  };

  return (
    <div className="rounded-lg border border-admin-border p-2">
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span key={tag} className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-admin-primary">
            {tag}
            <button type="button" onClick={() => removeTag(tag)} className="text-admin-muted hover:text-admin-danger">
              ×
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addTag();
            }
          }}
          onBlur={addTag}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="min-w-[8rem] flex-1 border-none p-1 text-sm outline-none"
        />
      </div>
    </div>
  );
}
