import type { ButtonTokens } from "../../../../types/theme";
import { RADIUS_STYLE_PX } from "../../../../lib/theme/defaults";
import { SegmentedControl } from "./SegmentedControl";

const STYLE_OPTIONS: { key: ButtonTokens["primaryStyle"]; label: string }[] = [
  { key: "solid", label: "To'liq" },
  { key: "outline", label: "Konturli" },
  { key: "soft", label: "Yumshoq" },
  { key: "ghost", label: "Shaffof" },
];

const SIZE_OPTIONS: { key: ButtonTokens["size"]; label: string }[] = [
  { key: "small", label: "Kichik" },
  { key: "medium", label: "O'rta" },
  { key: "large", label: "Katta" },
];

const HOVER_OPTIONS: { key: ButtonTokens["hoverEffect"]; label: string }[] = [
  { key: "none", label: "Yo'q" },
  { key: "lift", label: "Ko'tarilish" },
  { key: "glow", label: "Yorqinlik" },
  { key: "scale", label: "Kattalashish" },
];

const RADIUS_OPTIONS = [
  { key: "sharp", label: "O'tkir" },
  { key: "soft", label: "Yumshoq" },
  { key: "rounded", label: "Dumaloq" },
  { key: "pill", label: "Tabletka" },
];

const SIZE_PADDING: Record<ButtonTokens["size"], string> = {
  small: "0.375rem 0.875rem",
  medium: "0.625rem 1.25rem",
  large: "0.875rem 1.75rem",
};

const HOVER_CLASS: Record<ButtonTokens["hoverEffect"], string> = {
  none: "",
  lift: "hover:-translate-y-0.5 hover:shadow-md",
  glow: "hover:shadow-[0_0_0_4px_rgba(16,185,129,0.18)]",
  scale: "hover:scale-105",
};

function PreviewButton({ label, variant, tokens }: { label: string; variant: "primaryStyle" | "secondaryStyle"; tokens: ButtonTokens }) {
  const style = tokens[variant];
  const isPrimaryColor = variant === "primaryStyle";
  const base = isPrimaryColor ? "var(--rt-brand-primary, #0A4B3A)" : "var(--rt-brand-secondary, #487d25)";

  const styleMap: Record<ButtonTokens["primaryStyle"], React.CSSProperties> = {
    solid: { backgroundColor: base, color: "#fff", border: "1px solid transparent" },
    outline: { backgroundColor: "transparent", color: base, border: `1.5px solid ${base}` },
    soft: { backgroundColor: `${base}1A`, color: base, border: "1px solid transparent" },
    ghost: { backgroundColor: "transparent", color: base, border: "1px solid transparent" },
  };

  return (
    <button
      type="button"
      className={`text-sm font-semibold transition-all duration-200 ${HOVER_CLASS[tokens.hoverEffect]}`}
      style={{ ...styleMap[style], borderRadius: tokens.radius, padding: SIZE_PADDING[tokens.size] }}
    >
      {label}
    </button>
  );
}

export function ButtonSystemEditor({ tokens, onChange }: { tokens: ButtonTokens; onChange: (next: ButtonTokens) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <label className="mb-1.5 block text-xs font-medium text-admin-primary">Asosiy tugma uslubi</label>
        <SegmentedControl options={STYLE_OPTIONS} value={tokens.primaryStyle} onChange={(v) => onChange({ ...tokens, primaryStyle: v })} />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-admin-primary">Ikkinchi tugma uslubi</label>
        <SegmentedControl options={STYLE_OPTIONS} value={tokens.secondaryStyle} onChange={(v) => onChange({ ...tokens, secondaryStyle: v })} />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-admin-primary">O'lcham</label>
        <SegmentedControl options={SIZE_OPTIONS} value={tokens.size} onChange={(v) => onChange({ ...tokens, size: v })} />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-admin-primary">Hover effekti</label>
        <SegmentedControl options={HOVER_OPTIONS} value={tokens.hoverEffect} onChange={(v) => onChange({ ...tokens, hoverEffect: v })} />
      </div>

      <div>
        <label className="mb-2 block text-xs font-medium text-admin-primary">Tugma radiusi</label>
        <div className="grid grid-cols-4 gap-2.5">
          {RADIUS_OPTIONS.map((opt) => {
            const isSelected = tokens.radius === RADIUS_STYLE_PX[opt.key];
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => onChange({ ...tokens, radius: RADIUS_STYLE_PX[opt.key] })}
                className={`flex flex-col items-center gap-1.5 rounded-2xl border p-2.5 transition-all ${
                  isSelected ? "border-admin-primary bg-slate-50 ring-2 ring-admin-primary/15" : "border-admin-border hover:border-admin-primary/50"
                }`}
              >
                <span className="h-7 w-10 bg-slate-500" style={{ borderRadius: RADIUS_STYLE_PX[opt.key] }} />
                <span className="text-[11px] font-medium text-admin-primary">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-admin-border bg-slate-50 p-5">
        <PreviewButton label="Eksport katalogi" variant="primaryStyle" tokens={tokens} />
        <PreviewButton label="Batafsil" variant="secondaryStyle" tokens={tokens} />
      </div>
    </div>
  );
}
