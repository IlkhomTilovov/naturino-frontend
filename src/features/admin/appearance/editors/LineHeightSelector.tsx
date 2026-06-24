import { LINE_HEIGHT_VALUE } from "../../../../lib/theme/defaults";
import type { TypographyTokens } from "../../../../types/theme";

const OPTIONS: { key: TypographyTokens["lineHeight"]; label: string }[] = [
  { key: "compact", label: "Compact" },
  { key: "normal", label: "Normal" },
  { key: "relaxed", label: "Relaxed" },
];

export function LineHeightSelector({
  value,
  onChange,
  fontFamily,
}: {
  value: TypographyTokens["lineHeight"];
  onChange: (v: TypographyTokens["lineHeight"]) => void;
  fontFamily: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
      {OPTIONS.map((opt) => {
        const isSelected = value === opt.key;
        return (
          <button
            key={opt.key}
            type="button"
            onClick={() => onChange(opt.key)}
            className={`rounded-2xl border p-3 text-left transition-all ${
              isSelected ? "border-admin-primary bg-slate-50 ring-2 ring-admin-primary/15" : "border-admin-border hover:border-admin-primary/50"
            }`}
          >
            <p className="mb-1.5 text-xs font-semibold text-admin-primary">{opt.label}</p>
            <p className="text-[11px] text-admin-muted" style={{ fontFamily, lineHeight: LINE_HEIGHT_VALUE[opt.key] }}>
              Lorem ipsum dolor sit<br />Lorem ipsum dolor<br />Lorem ipsum
            </p>
          </button>
        );
      })}
    </div>
  );
}
