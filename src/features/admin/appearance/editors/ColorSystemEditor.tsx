import type { ColorTokens } from "../../../../types/theme";

function ColorInput({ label, hint, value, onChange }: { label: string; hint: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs font-medium text-admin-primary">{label}</label>
      <p className="text-[11px] text-admin-muted">{hint}</p>
      <div className="mt-1.5 flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-9 cursor-pointer rounded-md border border-admin-border"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-md border border-admin-border px-2 py-1.5 text-sm font-mono"
        />
        <button
          type="button"
          title="Nusxalash"
          onClick={() => navigator.clipboard?.writeText(value)}
          className="rounded-md px-1.5 py-1 text-xs text-admin-muted hover:bg-slate-100"
        >
          ⧉
        </button>
      </div>
    </div>
  );
}

export function ColorSystemEditor({ tokens, onChange }: { tokens: ColorTokens; onChange: (next: ColorTokens) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-admin-muted">Brend ranglar</p>
        <div className="grid grid-cols-2 gap-3">
          <ColorInput label="Asosiy rang" hint="Tugmalar, linklar" value={tokens.brand.primary} onChange={(v) => onChange({ ...tokens, brand: { ...tokens.brand, primary: v } })} />
          <ColorInput label="Ikkinchi darajali" hint="Kartalar, fonlar" value={tokens.brand.secondary} onChange={(v) => onChange({ ...tokens, brand: { ...tokens.brand, secondary: v } })} />
          <ColorInput label="Urg'u rang" hint="Aksentlar, badgelar" value={tokens.brand.accent} onChange={(v) => onChange({ ...tokens, brand: { ...tokens.brand, accent: v } })} />
          <ColorInput label="Muvaffaqiyat" hint="Success holatlar" value={tokens.brand.success} onChange={(v) => onChange({ ...tokens, brand: { ...tokens.brand, success: v } })} />
          <ColorInput label="Ogohlantirish" hint="Warning holatlar" value={tokens.brand.warning} onChange={(v) => onChange({ ...tokens, brand: { ...tokens.brand, warning: v } })} />
          <ColorInput label="Xato" hint="Error holatlar" value={tokens.brand.error} onChange={(v) => onChange({ ...tokens, brand: { ...tokens.brand, error: v } })} />
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-admin-muted">Sirt ranglari</p>
        <div className="grid grid-cols-2 gap-3">
          <ColorInput label="Orqa fon" hint="Sahifa foni" value={tokens.surface.background} onChange={(v) => onChange({ ...tokens, surface: { ...tokens.surface, background: v } })} />
          <ColorInput label="Karta" hint="Karta foni" value={tokens.surface.card} onChange={(v) => onChange({ ...tokens, surface: { ...tokens.surface, card: v } })} />
          <ColorInput label="Muted" hint="Ikkinchi darajali fon" value={tokens.surface.muted} onChange={(v) => onChange({ ...tokens, surface: { ...tokens.surface, muted: v } })} />
          <ColorInput label="Chegara" hint="Border rangi" value={tokens.surface.border} onChange={(v) => onChange({ ...tokens, surface: { ...tokens.surface, border: v } })} />
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-admin-muted">Matn ranglari</p>
        <div className="grid grid-cols-2 gap-3">
          <ColorInput label="Sarlavha" hint="Heading matn" value={tokens.text.heading} onChange={(v) => onChange({ ...tokens, text: { ...tokens.text, heading: v } })} />
          <ColorInput label="Asosiy matn" hint="Body matn" value={tokens.text.body} onChange={(v) => onChange({ ...tokens, text: { ...tokens.text, body: v } })} />
          <ColorInput label="Muted matn" hint="Ikkinchi darajali matn" value={tokens.text.muted} onChange={(v) => onChange({ ...tokens, text: { ...tokens.text, muted: v } })} />
          <ColorInput label="Teskari matn" hint="Qora fon ustida" value={tokens.text.inverse} onChange={(v) => onChange({ ...tokens, text: { ...tokens.text, inverse: v } })} />
        </div>
      </div>
    </div>
  );
}
