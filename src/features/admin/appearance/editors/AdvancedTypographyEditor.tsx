import type { TypographyTokens } from "../../../../types/theme";
import { InfoTooltip } from "./InfoTooltip";
import { PremiumSlider } from "./PremiumSlider";
import { SegmentedControl } from "./SegmentedControl";

export function AdvancedTypographyEditor({
  tokens,
  onChange,
}: {
  tokens: TypographyTokens;
  onChange: (next: TypographyTokens) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <div className="mb-1.5 flex items-center gap-1.5">
          <label className="text-xs font-medium text-admin-primary">Matn ko'rinishi</label>
          <InfoTooltip text="Matn katta-kichik harflarini avtomatik o'zgartiradi." />
        </div>
        <SegmentedControl
          value={tokens.textTransform}
          onChange={(v) => onChange({ ...tokens, textTransform: v })}
          options={[
            { key: "none", label: "Yo'q" },
            { key: "uppercase", label: "BOSH HARFLAR" },
            { key: "capitalize", label: "Har So'z Bosh Harf" },
            { key: "lowercase", label: "kichik harflar" },
          ]}
        />
      </div>

      <label className="flex items-center justify-between rounded-2xl border border-admin-border px-4 py-3">
        <span className="flex items-center gap-1.5 text-sm">
          <span className="font-medium text-admin-primary">Shrift silliqlashi</span>
          <InfoTooltip text="Shriftlarni ekran rezolutsiyasiga moslab tekislaydi (antialiasing)." />
        </span>
        <input
          type="checkbox"
          checked={tokens.fontSmoothing}
          onChange={(e) => onChange({ ...tokens, fontSmoothing: e.target.checked })}
        />
      </label>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-admin-primary">Render rejimi</label>
        <SegmentedControl
          value={tokens.renderingMode}
          onChange={(v) => onChange({ ...tokens, renderingMode: v })}
          options={[
            { key: "auto", label: "Avtomatik" },
            { key: "sharp", label: "O'tkir" },
            { key: "smooth", label: "Silliq" },
          ]}
        />
      </div>

      <PremiumSlider
        label="So'zlar orasi"
        value={tokens.wordSpacing}
        min={-4}
        max={12}
        onChange={(v) => onChange({ ...tokens, wordSpacing: v })}
      />

      <PremiumSlider
        label="Harflar orasi"
        value={tokens.charSpacing}
        min={-2}
        max={6}
        onChange={(v) => onChange({ ...tokens, charSpacing: v })}
      />
    </div>
  );
}
