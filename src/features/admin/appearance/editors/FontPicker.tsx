import { useEffect, useMemo, useState } from "react";
import { Building2, Gem, Rocket, Search, Sparkles, Trophy } from "lucide-react";
import { FONT_CATEGORY_LABELS, type FontBadge, type FontCategory, type FontDefinition } from "../../../../lib/theme/fontLibrary";
import { loadGoogleFonts } from "../../../../lib/theme/googleFonts";

const BADGE_ICON: Record<FontBadge, typeof Sparkles> = {
  recommended: Sparkles,
  popular: Trophy,
  luxury: Gem,
  modern: Rocket,
  corporate: Building2,
};

const BADGE_LABEL: Record<FontBadge, string> = {
  recommended: "Recommended",
  popular: "Most Popular",
  luxury: "Luxury",
  modern: "Modern",
  corporate: "Corporate",
};

const BADGE_CLASS: Record<FontBadge, string> = {
  recommended: "bg-admin-accent-50 text-admin-accent",
  popular: "bg-amber-50 text-amber-600",
  luxury: "bg-violet-50 text-violet-600",
  modern: "bg-sky-50 text-sky-600",
  corporate: "bg-slate-100 text-admin-muted",
};

const CATEGORY_ORDER: FontCategory[] = ["sans", "serif", "luxury"];

function FontCard({
  font,
  isSelected,
  onSelect,
  previewText,
}: {
  font: FontDefinition;
  isSelected: boolean;
  onSelect: () => void;
  previewText: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative flex flex-col gap-2 rounded-2xl border p-3.5 text-left transition-all duration-200 hover:-translate-y-px ${
        isSelected ? "border-admin-primary bg-slate-50 ring-2 ring-admin-primary/15" : "border-admin-border hover:border-admin-primary/50"
      }`}
    >
      {isSelected && (
        <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-admin-primary text-[10px] text-white">
          ✓
        </span>
      )}

      <div className="flex items-center gap-1.5 pr-6">
        <p className="text-sm font-semibold text-admin-primary">{font.name}</p>
        {font.badges?.map((badge) => {
          const Icon = BADGE_ICON[badge];
          return (
            <span
              key={badge}
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${BADGE_CLASS[badge]}`}
            >
              <Icon strokeWidth={1.8} className="h-3 w-3" />
              {BADGE_LABEL[badge]}
            </span>
          );
        })}
      </div>

      <p className="text-[11px] text-admin-muted">{font.type}</p>

      <p className="truncate text-lg" style={{ fontFamily: font.name }}>
        Aa {previewText}
      </p>

      <div className="flex flex-wrap gap-1">
        {font.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-admin-muted">
            {tag}
          </span>
        ))}
      </div>

      {font.recommendedFor && (
        <p className="text-[10px] text-admin-muted">
          Recommended for: {font.recommendedFor.join(", ")}.
        </p>
      )}
    </button>
  );
}

export function FontPicker({
  fonts,
  value,
  onChange,
  previewText = "Premium Pet Food Export",
}: {
  fonts: FontDefinition[];
  value: string;
  onChange: (font: string) => void;
  previewText?: string;
}) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return fonts;
    return fonts.filter((f) => {
      const haystack = [
        f.name,
        f.type,
        ...f.tags,
        ...f.categories.map((c) => FONT_CATEGORY_LABELS[c]),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [fonts, search]);

  useEffect(() => {
    loadGoogleFonts(filtered.map((f) => ({ name: f.name, weights: f.weights })));
  }, [filtered]);

  const groups = useMemo(() => {
    return CATEGORY_ORDER.map((category) => ({
      category,
      label: FONT_CATEGORY_LABELS[category],
      items: filtered.filter((f) => f.categories.includes(category)),
    })).filter((group) => group.items.length > 0);
  }, [filtered]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search strokeWidth={1.8} className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-admin-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search fonts..."
          className="h-11 w-full rounded-2xl border border-admin-border pl-10 pr-4 text-sm transition-colors focus:border-admin-primary focus:outline-none focus:ring-4 focus:ring-admin-primary/10"
        />
      </div>

      {groups.map((group) => (
        <div key={group.category} className="space-y-2">
          <p className="px-1 text-[11px] font-semibold uppercase tracking-wide text-admin-muted/70">{group.label}</p>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {group.items.map((font) => (
              <FontCard
                key={`${group.category}-${font.name}`}
                font={font}
                isSelected={value === font.name}
                onSelect={() => onChange(font.name)}
                previewText={previewText}
              />
            ))}
          </div>
        </div>
      ))}

      {groups.length === 0 && <p className="text-sm text-admin-muted">Shrift topilmadi.</p>}
    </div>
  );
}
