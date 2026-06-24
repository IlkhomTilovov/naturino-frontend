import type { ColorTokens } from "../../types/theme";
import { DEFAULT_BUTTON_TOKENS, DEFAULT_RADIUS_TOKENS, DEFAULT_SHADOW_TOKENS, DEFAULT_TYPOGRAPHY_TOKENS } from "../theme/defaults";

export interface ThemePreset {
  name: string;
  description: string;
  fontHeading: string;
  fontBody: string;
  colors: ColorTokens;
  radiusStyle: string;
  shadowLevel: string;
}

function colors(primary: string, secondary: string, accent: string, background: string, card: string): ColorTokens {
  return {
    brand: { primary, secondary, accent, success: "#22C55E", warning: "#F59E0B", error: "#EF4444" },
    surface: { background, card, muted: "#F3F5EF", border: "#E5E7EB", hover: "#F8FAF5" },
    text: { heading: "#0F172A", body: "#334155", muted: "#64748B", inverse: "#FFFFFF" },
  };
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    name: "Naturino Export",
    description: "Green + Cream + Gold",
    fontHeading: "Geist",
    fontBody: "Geist",
    colors: colors("#0A4B3A", "#487d25", "#f7a83b", "#FAFAF7", "#FFFFFF"),
    radiusStyle: "soft",
    shadowLevel: "2",
  },
  {
    name: "OrisHome Premium",
    description: "Dark Green + Beige",
    fontHeading: "Inter",
    fontBody: "Inter",
    colors: colors("#1F2D24", "#2F4F1F", "#D9C5A0", "#FAF8F4", "#FFFFFF"),
    radiusStyle: "modern",
    shadowLevel: "2",
  },
  {
    name: "MirMexa Corporate",
    description: "Navy + White + Steel",
    fontHeading: "Inter",
    fontBody: "Inter",
    colors: colors("#0F1E33", "#29333D", "#435670", "#FFFFFF", "#F3F5F8"),
    radiusStyle: "soft",
    shadowLevel: "1",
  },
  {
    name: "Modern Luxury",
    description: "Black + Gold + Ivory",
    fontHeading: "Lora",
    fontBody: "Inter",
    colors: colors("#111111", "#C9A227", "#E8DCC0", "#FFFDF8", "#FFFFFF"),
    radiusStyle: "sharp",
    shadowLevel: "3",
  },
  {
    name: "Medical Clinic",
    description: "Blue + White + Soft Gray",
    fontHeading: "Inter",
    fontBody: "Inter",
    colors: colors("#1D4ED8", "#0EA5E9", "#38BDF8", "#F8FAFC", "#FFFFFF"),
    radiusStyle: "rounded",
    shadowLevel: "1",
  },
  {
    name: "Real Estate Premium",
    description: "Black + Beige + Bronze",
    fontHeading: "Montserrat",
    fontBody: "Inter",
    colors: colors("#1A1A1A", "#A9826A", "#C9A267", "#FAF7F2", "#FFFFFF"),
    radiusStyle: "soft",
    shadowLevel: "2",
  },
  {
    name: "Fashion Luxury",
    description: "Black + Nude + Gold",
    fontHeading: "Lora",
    fontBody: "Inter",
    colors: colors("#0D0D0D", "#D8B49A", "#C7A24A", "#FFFCF9", "#FFFFFF"),
    radiusStyle: "sharp",
    shadowLevel: "3",
  },
  {
    name: "Restaurant Warm",
    description: "Brown + Cream + Olive",
    fontHeading: "Montserrat",
    fontBody: "Inter",
    colors: colors("#5B3A1E", "#7A8450", "#D9A24B", "#FFF8EE", "#FFFFFF"),
    radiusStyle: "rounded",
    shadowLevel: "2",
  },
];

export function presetToFormPatch(preset: ThemePreset) {
  return {
    fontHeading: preset.fontHeading,
    fontBody: preset.fontBody,
    colorTokensJson: JSON.stringify(preset.colors),
    typographyTokensJson: JSON.stringify(DEFAULT_TYPOGRAPHY_TOKENS),
    radiusTokensJson: JSON.stringify({ ...DEFAULT_RADIUS_TOKENS, style: preset.radiusStyle }),
    shadowTokensJson: JSON.stringify({ ...DEFAULT_SHADOW_TOKENS, level: preset.shadowLevel }),
    buttonTokensJson: JSON.stringify(DEFAULT_BUTTON_TOKENS),
  };
}
