import { FormSectionCard } from "../../../../components/admin/FormSectionCard";
import { MAX_CONTENT_WIDTH_PX, SECTION_SPACING_PX } from "../../../../lib/theme/defaults";
import type { LayoutTokens } from "../../../../types/theme";
import { SegmentedControl } from "./SegmentedControl";

function GapPreview({ gap }: { gap: number }) {
  return (
    <div className="flex h-8" style={{ gap }}>
      <span className="flex-1 rounded bg-slate-200" />
      <span className="flex-1 rounded bg-slate-200" />
      <span className="flex-1 rounded bg-slate-200" />
    </div>
  );
}

export function LayoutEditor({ tokens, onChange }: { tokens: LayoutTokens; onChange: (next: LayoutTokens) => void }) {
  return (
    <div className="space-y-4">
      <FormSectionCard title="Konteyner kengligi" description="Sahifa kontentining maksimal kengligi">
        <SegmentedControl
          value={tokens.containerWidth}
          onChange={(v) => onChange({ ...tokens, containerWidth: v })}
          options={[
            { key: "1200", label: "1200px" },
            { key: "1320", label: "1320px" },
            { key: "1400", label: "1400px" },
            { key: "1536", label: "1536px" },
          ]}
        />
      </FormSectionCard>

      <FormSectionCard title="Bo'lim oraliqlari" description="Sahifa bo'limlari orasidagi bo'sh joy">
        <div className="space-y-3">
          <SegmentedControl
            value={tokens.sectionSpacing}
            onChange={(v) => onChange({ ...tokens, sectionSpacing: v })}
            options={[
              { key: "compact", label: "Ixcham" },
              { key: "comfortable", label: "Qulay" },
              { key: "spacious", label: "Keng" },
            ]}
          />
          <div className="flex flex-col gap-1.5 rounded-xl border border-admin-border p-3">
            <span className="h-6 rounded bg-slate-100" />
            <span className="h-2" style={{ height: SECTION_SPACING_PX[tokens.sectionSpacing] / 4 }} />
            <span className="h-6 rounded bg-slate-100" />
          </div>
        </div>
      </FormSectionCard>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormSectionCard title="Grid bo'shlig'i" description="Kartalar orasidagi masofa">
          <div className="space-y-3">
            <SegmentedControl
              value={tokens.gridGap}
              onChange={(v) => onChange({ ...tokens, gridGap: v })}
              options={[
                { key: "16", label: "16px" },
                { key: "24", label: "24px" },
                { key: "32", label: "32px" },
              ]}
            />
            <GapPreview gap={Number(tokens.gridGap)} />
          </div>
        </FormSectionCard>

        <FormSectionCard title="Karta bo'shlig'i" description="Karta ichki bo'shlig'i">
          <div className="space-y-3">
            <SegmentedControl
              value={tokens.cardGap}
              onChange={(v) => onChange({ ...tokens, cardGap: v })}
              options={[
                { key: "16", label: "16px" },
                { key: "24", label: "24px" },
                { key: "32", label: "32px" },
              ]}
            />
            <GapPreview gap={Number(tokens.cardGap)} />
          </div>
        </FormSectionCard>
      </div>

      <FormSectionCard title="Maksimal kontent kengligi" description="Matn bloklari uchun o'qish qulayligi">
        <SegmentedControl
          value={tokens.maxContentWidth}
          onChange={(v) => onChange({ ...tokens, maxContentWidth: v })}
          options={[
            { key: "narrow", label: `Tor (${MAX_CONTENT_WIDTH_PX.narrow}px)` },
            { key: "standard", label: `Standart (${MAX_CONTENT_WIDTH_PX.standard}px)` },
            { key: "wide", label: `Keng (${MAX_CONTENT_WIDTH_PX.wide}px)` },
          ]}
        />
      </FormSectionCard>
    </div>
  );
}
