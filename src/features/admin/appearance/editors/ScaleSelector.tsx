import { FONT_SCALE_PX } from "../../../../lib/theme/defaults";
import type { TypographyTokens } from "../../../../types/theme";

const SCALES: { key: TypographyTokens["fontScale"]; label: string }[] = [
  { key: "small", label: "Kichik" },
  { key: "medium", label: "O'rta" },
  { key: "large", label: "Katta" },
  { key: "xlarge", label: "Juda katta" },
];

export function ScaleSelector({
  value,
  onChange,
  fontFamily,
}: {
  value: TypographyTokens["fontScale"];
  onChange: (scale: TypographyTokens["fontScale"]) => void;
  fontFamily: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
      {SCALES.map((s) => {
        const px = FONT_SCALE_PX[s.key];
        const isSelected = value === s.key;
        return (
          <button
            key={s.key}
            type="button"
            onClick={() => onChange(s.key)}
            className={`flex flex-col gap-1 rounded-2xl border p-3 text-left transition-all ${
              isSelected ? "border-admin-primary bg-slate-50 ring-2 ring-admin-primary/15" : "border-admin-border hover:border-admin-primary/50"
            }`}
            style={{ fontFamily }}
          >
            <span className="text-[10px] font-semibold uppercase text-admin-muted">{s.label}</span>
            <span className="font-bold" style={{ fontSize: px.h1 / 2.2 }}>H1</span>
            <span className="font-semibold text-admin-muted" style={{ fontSize: px.h3 / 2.2 }}>H3</span>
          </button>
        );
      })}
    </div>
  );
}
