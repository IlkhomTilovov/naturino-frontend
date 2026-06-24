import { FONT_SCALE_PX, LINE_HEIGHT_VALUE, PARAGRAPH_WIDTH_PX } from "../../../../lib/theme/defaults";
import type { TypographyTokens } from "../../../../types/theme";

export function TypographyPreviewCard({
  tokens,
  fontHeading,
  fontBody,
}: {
  tokens: TypographyTokens;
  fontHeading: string;
  fontBody: string;
}) {
  const scale = FONT_SCALE_PX[tokens.fontScale];
  const headingStyle: React.CSSProperties = {
    fontFamily: fontHeading,
    fontWeight: Number(tokens.headingWeight),
    fontSize: scale.h2,
    letterSpacing: `${tokens.letterSpacing}px`,
    textTransform: tokens.textTransform,
    WebkitFontSmoothing: tokens.fontSmoothing ? "antialiased" : "auto",
  };
  const bodyStyle: React.CSSProperties = {
    fontFamily: fontBody,
    fontWeight: Number(tokens.bodyWeight),
    lineHeight: LINE_HEIGHT_VALUE[tokens.lineHeight],
    wordSpacing: `${tokens.wordSpacing}px`,
    letterSpacing: `${tokens.charSpacing}px`,
    maxWidth: PARAGRAPH_WIDTH_PX[tokens.paragraphWidth],
  };

  return (
    <div className="rounded-2xl border border-admin-border bg-white p-6">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-admin-muted">Typography Preview</p>

      <span className="mb-3 inline-block rounded-full bg-admin-accent-50 px-3 py-1 text-[11px] font-semibold uppercase text-admin-accent">
        ISO 22000
      </span>

      <h3 className="text-admin-primary" style={headingStyle}>
        Premium Pet Food Export
      </h3>

      <p className="mt-3 text-sm text-admin-muted" style={bodyStyle}>
        Naturino produces premium pet food products for international distributors and importers. Export-ready
        documentation and certified manufacturing processes ensure consistent quality.
      </p>

      <button
        type="button"
        className="mt-4 rounded-full bg-admin-primary px-5 py-2.5 text-sm font-semibold text-white"
        style={{ fontFamily: fontBody }}
      >
        Export Catalog
      </button>

      <div className="mt-5 grid grid-cols-3 gap-3 border-t border-admin-border pt-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-admin-border p-2.5">
            <div className="mb-2 h-10 rounded-lg bg-slate-100" />
            <p className="truncate text-xs font-medium text-admin-primary" style={{ fontFamily: fontHeading }}>
              Mahsulot {i}
            </p>
            <p className="text-[11px] text-admin-muted" style={{ fontFamily: fontBody }}>
              1 250 000 so'm
            </p>
          </div>
        ))}
      </div>

      <p className="mt-5 border-t border-admin-border pt-4 text-[11px] text-admin-muted" style={{ fontFamily: fontBody }}>
        © Naturino by Steppe Nutrition — Premium pet food export
      </p>
    </div>
  );
}
