import { useState } from "react";
import type { BrandingTokens, ButtonTokens, ColorTokens, RadiusTokens, ShadowTokens, TypographyTokens } from "../../../../types/theme";
import { DEFAULT_TYPOGRAPHY_TOKENS, LINE_HEIGHT_VALUE, RADIUS_STYLE_PX, SHADOW_LEVEL_VALUE } from "../../../../lib/theme/defaults";

export function LivePreviewPanel({
  colors,
  radius,
  shadow,
  buttons,
  branding,
  fontHeading,
  fontBody,
  typography = DEFAULT_TYPOGRAPHY_TOKENS,
}: {
  colors: ColorTokens;
  radius: RadiusTokens;
  shadow: ShadowTokens;
  buttons: ButtonTokens;
  branding: BrandingTokens;
  fontHeading: string;
  fontBody: string;
  typography?: TypographyTokens;
}) {
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const cardRadius = RADIUS_STYLE_PX[radius.style];
  const cardShadow = SHADOW_LEVEL_VALUE[shadow.level];
  const headingStyle = { fontFamily: fontHeading, color: colors.text.heading, fontWeight: Number(typography.headingWeight), letterSpacing: `${typography.letterSpacing}px`, textTransform: typography.textTransform } as const;
  const bodyStyle = { color: colors.text.muted, lineHeight: LINE_HEIGHT_VALUE[typography.lineHeight] };

  return (
    <div className="sticky top-6 rounded-2xl border border-admin-border bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-sm font-medium text-admin-primary">👁 Jonli ko'rinish</p>
        <div className="flex gap-1 rounded-md bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setDevice("desktop")}
            className={`rounded px-2 py-1 text-xs ${device === "desktop" ? "bg-white shadow-sm" : "text-admin-muted"}`}
          >
            🖥
          </button>
          <button
            type="button"
            onClick={() => setDevice("tablet")}
            className={`rounded px-2 py-1 text-xs ${device === "tablet" ? "bg-white shadow-sm" : "text-admin-muted"}`}
          >
            📔
          </button>
          <button
            type="button"
            onClick={() => setDevice("mobile")}
            className={`rounded px-2 py-1 text-xs ${device === "mobile" ? "bg-white shadow-sm" : "text-admin-muted"}`}
          >
            📱
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden rounded-xl border border-admin-border transition-all ${device === "mobile" ? "mx-auto max-w-[320px]" : device === "tablet" ? "mx-auto max-w-[460px]" : ""}`}
        style={{ backgroundColor: colors.surface.background, fontFamily: fontBody, color: colors.text.body }}
      >
        <div className="flex items-center justify-between px-4 py-3" style={{ backgroundColor: colors.surface.card }}>
          <p className="text-sm font-bold" style={headingStyle}>
            {branding.brandName || "BRAND"}
          </p>
          <div className="flex gap-2 text-[11px]" style={{ color: colors.text.muted }}>
            <span>BOSH</span>
            <span>KATALOG</span>
            <span
              className="rounded px-2 py-1 font-semibold text-white"
              style={{ backgroundColor: colors.brand.primary, borderRadius: cardRadius }}
            >
              BOG'LANISH
            </span>
          </div>
        </div>

        <div className="px-4 py-5">
          <p className="text-lg font-bold" style={headingStyle}>
            Premium mahsulotlar
          </p>
          <p className="mt-1 text-xs" style={bodyStyle}>{branding.tagline}</p>

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              className="px-3 py-1.5 text-xs font-semibold"
              style={{
                backgroundColor: buttons.primaryStyle === "outline" ? "transparent" : colors.brand.primary,
                border: buttons.primaryStyle === "outline" ? `1px solid ${colors.brand.primary}` : "none",
                color: buttons.primaryStyle === "outline" ? colors.brand.primary : colors.text.inverse,
                borderRadius: buttons.radius,
              }}
            >
              Katalogni ko'rish
            </button>
            <button
              type="button"
              className="px-3 py-1.5 text-xs font-semibold"
              style={{
                backgroundColor: "transparent",
                border: `1px solid ${colors.surface.border}`,
                color: colors.text.body,
                borderRadius: buttons.radius,
              }}
            >
              Batafsil
            </button>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-2"
                style={{ backgroundColor: colors.surface.card, borderRadius: cardRadius, boxShadow: cardShadow }}
              >
                <div className="mb-1.5 h-12 rounded" style={{ backgroundColor: colors.surface.muted }} />
                <span
                  className="inline-block rounded px-1.5 py-0.5 text-[9px] font-semibold text-white"
                  style={{ backgroundColor: colors.brand.accent }}
                >
                  YANGI
                </span>
                <p className="mt-1 text-[10px] font-medium" style={{ color: colors.text.heading }}>
                  Mahsulot {i}
                </p>
                <p className="text-[10px]" style={{ color: colors.text.muted }}>
                  1 250 000 so'm
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <label className="text-[10px]" style={{ color: colors.text.muted }}>Email</label>
            <input
              readOnly
              placeholder="sample@email.com"
              className="mt-1 w-full px-2 py-1.5 text-[11px]"
              style={{ border: `1px solid ${colors.surface.border}`, borderRadius: cardRadius, backgroundColor: colors.surface.card }}
            />
          </div>

          <div className="mt-3 flex gap-1.5">
            {["CHEGIRMA", "YANGI", "TAVSIYA"].map((badge) => (
              <span
                key={badge}
                className="rounded-full px-2 py-1 text-[9px] font-semibold text-white"
                style={{ backgroundColor: colors.brand.secondary }}
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
