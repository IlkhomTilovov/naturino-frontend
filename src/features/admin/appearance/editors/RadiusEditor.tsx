import type { RadiusTokens } from "../../../../types/theme";
import { RADIUS_STYLE_PX } from "../../../../lib/theme/defaults";

const OPTIONS: { key: RadiusTokens["style"]; label: string }[] = [
  { key: "sharp", label: "O'tkir" },
  { key: "soft", label: "Yumshoq" },
  { key: "rounded", label: "Dumaloq" },
  { key: "modern", label: "Zamonaviy" },
  { key: "pill", label: "Tabletka" },
];

export function RadiusEditor({ tokens, onChange }: { tokens: RadiusTokens; onChange: (next: RadiusTokens) => void }) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
      {OPTIONS.map((opt) => (
        <button
          key={opt.key}
          type="button"
          onClick={() => onChange({ ...tokens, style: opt.key })}
          className={`flex flex-col items-center gap-2 rounded-xl border p-3 transition-colors ${
            tokens.style === opt.key ? "border-admin-primary bg-slate-50" : "border-admin-border hover:border-admin-primary"
          }`}
        >
          <span className="h-10 w-10 bg-slate-600" style={{ borderRadius: RADIUS_STYLE_PX[opt.key] }} />
          <span className="text-xs font-medium text-admin-primary">{opt.label}</span>
        </button>
      ))}
    </div>
  );
}
