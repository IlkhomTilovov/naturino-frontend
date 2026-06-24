import { FormSectionCard } from "../../../../components/admin/FormSectionCard";
import { FONT_LIBRARY } from "../../../../lib/theme/fontLibrary";
import type { TypographyTokens } from "../../../../types/theme";
import { AdvancedTypographyEditor } from "./AdvancedTypographyEditor";
import { FontPicker } from "./FontPicker";
import { InfoTooltip } from "./InfoTooltip";
import { LineHeightSelector } from "./LineHeightSelector";
import { ParagraphWidthSelector } from "./ParagraphWidthSelector";
import { PremiumSlider } from "./PremiumSlider";
import { ScaleSelector } from "./ScaleSelector";
import { TypographyPreviewCard } from "./TypographyPreviewCard";
import { WeightSelector } from "./WeightSelector";

export function TypographyEditor({
  tokens,
  fontHeading,
  fontBody,
  onChange,
  onFontChange,
}: {
  tokens: TypographyTokens;
  fontHeading: string;
  fontBody: string;
  onChange: (next: TypographyTokens) => void;
  onFontChange: (fontHeading: string, fontBody: string) => void;
}) {
  return (
    <div className="space-y-4">
      <FormSectionCard title="Heading Typography" description="Control all heading styles used across the website.">
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-xs font-medium text-admin-primary">Heading Font Family</label>
            <FontPicker fonts={FONT_LIBRARY} value={fontHeading} onChange={(f) => onFontChange(f, fontBody)} />
          </div>

          <div>
            <div className="mb-2 flex items-center gap-1.5">
              <label className="text-xs font-medium text-admin-primary">Heading Weight</label>
              <InfoTooltip text="700 = Bold. Recommended for hero sections and primary headings." />
            </div>
            <WeightSelector value={tokens.headingWeight} fontFamily={fontHeading} onChange={(w) => onChange({ ...tokens, headingWeight: w })} />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-admin-primary">Heading Scale</label>
            <ScaleSelector value={tokens.fontScale} fontFamily={fontHeading} onChange={(s) => onChange({ ...tokens, fontScale: s })} />
          </div>

          <PremiumSlider
            label="Heading Letter Spacing"
            value={tokens.letterSpacing}
            min={-2}
            max={6}
            onChange={(v) => onChange({ ...tokens, letterSpacing: v })}
          />
        </div>
      </FormSectionCard>

      <FormSectionCard title="Body Typography" description="Control paragraph and body text styles.">
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-xs font-medium text-admin-primary">Body Font</label>
            <FontPicker
              fonts={FONT_LIBRARY}
              value={fontBody}
              onChange={(f) => onFontChange(fontHeading, f)}
              previewText="produces premium pet food for export."
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-admin-primary">Body Weight</label>
            <WeightSelector value={tokens.bodyWeight} fontFamily={fontBody} onChange={(w) => onChange({ ...tokens, bodyWeight: w })} />
          </div>

          <div>
            <div className="mb-2 flex items-center gap-1.5">
              <label className="text-xs font-medium text-admin-primary">Line Height</label>
              <InfoTooltip text="Controls spacing between lines of text. Recommended: 1.5 - 1.7" />
            </div>
            <LineHeightSelector value={tokens.lineHeight} fontFamily={fontBody} onChange={(v) => onChange({ ...tokens, lineHeight: v })} />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-admin-primary">Paragraph Width</label>
            <ParagraphWidthSelector value={tokens.paragraphWidth} onChange={(v) => onChange({ ...tokens, paragraphWidth: v })} />
          </div>
        </div>
      </FormSectionCard>

      <FormSectionCard title="Advanced Typography" description="Fine-tune rendering and spacing details.">
        <AdvancedTypographyEditor tokens={tokens} onChange={onChange} />
      </FormSectionCard>

      <FormSectionCard title="Typography Preview" description="Realistic preview of your typography settings.">
        <TypographyPreviewCard tokens={tokens} fontHeading={fontHeading} fontBody={fontBody} />
      </FormSectionCard>
    </div>
  );
}
