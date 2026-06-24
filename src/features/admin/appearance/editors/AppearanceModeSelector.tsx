import type { AppearanceMode } from "../../../../types/theme";

const OPTIONS: { key: AppearanceMode; label: string; icon: string }[] = [
  { key: "light", label: "Light Mode", icon: "☀️" },
  { key: "dark", label: "Dark Mode", icon: "🌙" },
  { key: "auto", label: "Auto Mode", icon: "🌗" },
];

export function AppearanceModeSelector({ value, onChange }: { value: AppearanceMode; onChange: (v: AppearanceMode) => void }) {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {OPTIONS.map((opt) => {
        const isSelected = value === opt.key;
        return (
          <button
            key={opt.key}
            type="button"
            onClick={() => onChange(opt.key)}
            className={`flex flex-col items-center gap-1.5 rounded-2xl border p-4 transition-all ${
              isSelected ? "border-admin-primary bg-slate-50 ring-2 ring-admin-primary/15" : "border-admin-border hover:border-admin-primary/50"
            }`}
          >
            <span className="text-xl">{opt.icon}</span>
            <span className="text-xs font-medium text-admin-primary">{opt.label}</span>
            {isSelected && <span className="text-[10px] text-admin-accent">✓ Tanlandi</span>}
          </button>
        );
      })}
    </div>
  );
}
