import { THEME_PRESETS } from "../../../../lib/data/themePresets";

export function PresetThemeGrid({ onApply }: { onApply: (presetIndex: number) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {THEME_PRESETS.map((preset, i) => (
        <button
          key={preset.name}
          type="button"
          onClick={() => onApply(i)}
          className="flex flex-col gap-2 rounded-xl border border-admin-border p-3 text-left transition-colors hover:border-admin-primary"
        >
          <div className="flex h-8 gap-1 overflow-hidden rounded-md">
            <span className="flex-1" style={{ backgroundColor: preset.colors.brand.primary }} />
            <span className="flex-1" style={{ backgroundColor: preset.colors.brand.secondary }} />
            <span className="flex-1" style={{ backgroundColor: preset.colors.brand.accent }} />
          </div>
          <p className="text-xs font-semibold text-admin-primary">{preset.name}</p>
          <p className="text-[11px] text-admin-muted">{preset.description}</p>
        </button>
      ))}
    </div>
  );
}
