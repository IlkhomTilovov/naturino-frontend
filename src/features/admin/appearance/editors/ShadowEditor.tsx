import type { ShadowTokens } from "../../../../types/theme";
import { SHADOW_LEVEL_VALUE } from "../../../../lib/theme/defaults";

const LEVELS = ["0", "1", "2", "3", "4"];

export function ShadowEditor({ tokens, onChange }: { tokens: ShadowTokens; onChange: (next: ShadowTokens) => void }) {
  return (
    <div className="grid grid-cols-5 gap-3">
      {LEVELS.map((level) => (
        <button
          key={level}
          type="button"
          onClick={() => onChange({ ...tokens, level })}
          className={`flex flex-col items-center gap-2 rounded-xl border p-3 transition-colors ${
            tokens.level === level ? "border-admin-primary bg-slate-50" : "border-admin-border hover:border-admin-primary"
          }`}
        >
          <span className="h-10 w-10 rounded-lg bg-white" style={{ boxShadow: SHADOW_LEVEL_VALUE[level] }} />
          <span className="text-xs font-medium text-admin-primary">Daraja {level}</span>
        </button>
      ))}
    </div>
  );
}
