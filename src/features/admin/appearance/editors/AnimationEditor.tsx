import { FormSectionCard } from "../../../../components/admin/FormSectionCard";
import { ANIMATION_SPEED_MS } from "../../../../lib/theme/defaults";
import type { AnimationTokens } from "../../../../types/theme";
import { SegmentedControl } from "./SegmentedControl";

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between rounded-xl border border-admin-border px-4 py-3">
      <span>
        <span className="block text-sm font-medium text-admin-primary">{label}</span>
        <span className="block text-xs text-admin-muted">{description}</span>
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors ${checked ? "bg-admin-primary" : "bg-slate-300"}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
      </button>
    </label>
  );
}

export function AnimationEditor({ tokens, onChange }: { tokens: AnimationTokens; onChange: (next: AnimationTokens) => void }) {
  const speedMs = ANIMATION_SPEED_MS[tokens.speed];

  return (
    <div className="space-y-4">
      <FormSectionCard title="Harakat sozlamalari" description="Saytdagi animatsiyalarni yoqing/o'chiring">
        <div className="space-y-2.5">
          <ToggleRow label="Hover Animation" description="Umumiy hover effektlari" checked={tokens.hoverAnimation} onChange={(v) => onChange({ ...tokens, hoverAnimation: v })} />
          <ToggleRow label="Card Hover" description="Kartalar hover holatida ko'tariladi" checked={tokens.cardHover} onChange={(v) => onChange({ ...tokens, cardHover: v })} />
          <ToggleRow label="Button Hover" description="Tugmalar hover animatsiyasi" checked={tokens.buttonHover} onChange={(v) => onChange({ ...tokens, buttonHover: v })} />
          <ToggleRow label="Scroll Reveal" description="Sahifa skroll qilinganda elementlar paydo bo'ladi" checked={tokens.scrollReveal} onChange={(v) => onChange({ ...tokens, scrollReveal: v })} />
          <ToggleRow label="Fade In" description="Elementlar asta-sekin ko'rinadi" checked={tokens.fadeIn} onChange={(v) => onChange({ ...tokens, fadeIn: v })} />
        </div>
      </FormSectionCard>

      <FormSectionCard title="Animatsiya tezligi" description="Barcha o'tish effektlari davomiyligi">
        <SegmentedControl
          value={tokens.speed}
          onChange={(v) => onChange({ ...tokens, speed: v })}
          options={[
            { key: "slow", label: "Slow" },
            { key: "medium", label: "Medium" },
            { key: "fast", label: "Fast" },
          ]}
        />
      </FormSectionCard>

      <FormSectionCard title="Preview" description="Har bir effektni sinab ko'ring">
        <div className="flex flex-wrap gap-4">
          <div
            className={`flex h-16 w-28 items-center justify-center rounded-xl border border-admin-border bg-white text-xs font-medium text-admin-muted ${
              tokens.cardHover ? "transition-transform hover:-translate-y-1 hover:shadow-md" : ""
            }`}
            style={{ transitionDuration: `${speedMs}ms` }}
          >
            Card Hover
          </div>
          <button
            type="button"
            className={`h-16 w-28 rounded-xl bg-admin-primary text-xs font-medium text-white ${
              tokens.buttonHover ? "transition-transform hover:scale-105" : ""
            }`}
            style={{ transitionDuration: `${speedMs}ms` }}
          >
            Button Hover
          </button>
        </div>
      </FormSectionCard>
    </div>
  );
}
