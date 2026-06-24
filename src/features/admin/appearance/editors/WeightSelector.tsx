import { FONT_WEIGHTS } from "../../../../lib/theme/defaults";

export function WeightSelector({
  value,
  onChange,
  fontFamily,
}: {
  value: string;
  onChange: (weight: string) => void;
  fontFamily: string;
}) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
      {FONT_WEIGHTS.map((w) => {
        const isSelected = value === w.value;
        return (
          <button
            key={w.value}
            type="button"
            onClick={() => onChange(w.value)}
            className={`flex flex-col items-center gap-1 rounded-2xl border p-3 transition-all ${
              isSelected ? "border-admin-primary bg-slate-50 ring-2 ring-admin-primary/15" : "border-admin-border hover:border-admin-primary/50"
            }`}
          >
            <span className="text-lg" style={{ fontFamily, fontWeight: Number(w.value) }}>Aa</span>
            <span className="text-[11px] font-medium text-admin-primary">{w.value}</span>
            <span className="text-[10px] text-admin-muted">{w.label}</span>
          </button>
        );
      })}
    </div>
  );
}
