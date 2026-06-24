import { useState } from "react";

interface FontOption {
  name: string;
  type: string;
  recommended?: boolean;
}

export function FontPicker({
  fonts,
  value,
  onChange,
  previewText = "Premium Pet Food Export",
}: {
  fonts: FontOption[];
  value: string;
  onChange: (font: string) => void;
  previewText?: string;
}) {
  const [search, setSearch] = useState("");
  const filtered = fonts.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-3">
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search fonts..."
          className="h-11 w-full rounded-2xl border border-admin-border px-4 text-sm transition-colors focus:border-admin-primary focus:outline-none focus:ring-4 focus:ring-admin-primary/10"
        />
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {filtered.map((font) => {
          const isSelected = value === font.name;
          return (
            <button
              key={font.name}
              type="button"
              onClick={() => onChange(font.name)}
              className={`relative flex flex-col gap-1 rounded-2xl border p-3.5 text-left transition-all ${
                isSelected ? "border-admin-primary bg-slate-50 ring-2 ring-admin-primary/15" : "border-admin-border hover:border-admin-primary/50"
              }`}
            >
              {isSelected && (
                <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-admin-primary text-[10px] text-white">
                  ✓
                </span>
              )}
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-admin-primary">{font.name}</p>
                {font.recommended && (
                  <span className="rounded-full bg-admin-accent-50 px-2 py-0.5 text-[10px] font-semibold uppercase text-admin-accent">
                    Recommended
                  </span>
                )}
              </div>
              <p className="text-[11px] text-admin-muted">{font.type}</p>
              <p className="mt-1 truncate text-lg" style={{ fontFamily: font.name }}>
                Aa {previewText}
              </p>
              {font.recommended && (
                <p className="text-[10px] text-admin-muted">Naturino uchun tavsiya etiladi.</p>
              )}
            </button>
          );
        })}
        {filtered.length === 0 && <p className="col-span-2 text-sm text-admin-muted">Shrift topilmadi.</p>}
      </div>
    </div>
  );
}
