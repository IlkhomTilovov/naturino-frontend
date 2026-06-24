import type { AnimationTokens, BrandingTokens, ButtonTokens, ColorTokens, LayoutTokens, RadiusTokens, ShadowTokens, TypographyTokens } from "../../types/theme";

export const DEFAULT_COLOR_TOKENS: ColorTokens = {
  brand: { primary: "#0A4B3A", secondary: "#487d25", accent: "#f7a83b", success: "#22C55E", warning: "#F59E0B", error: "#EF4444" },
  surface: { background: "#FAFAF7", card: "#FFFFFF", muted: "#F3F5EF", border: "#E5E7EB", hover: "#F8FAF5" },
  text: { heading: "#0F172A", body: "#334155", muted: "#64748B", inverse: "#FFFFFF" },
};

export const DEFAULT_TYPOGRAPHY_TOKENS: TypographyTokens = {
  fontScale: "medium",
  headingWeight: "700",
  bodyWeight: "400",
  lineHeight: "normal",
  letterSpacing: 0,
  paragraphWidth: "standard",
  textTransform: "none",
  fontSmoothing: true,
  renderingMode: "auto",
  wordSpacing: 0,
  charSpacing: 0,
};

export const FONT_SCALE_PX: Record<string, { h1: number; h2: number; h3: number; h4: number }> = {
  small: { h1: 28, h2: 22, h3: 18, h4: 15 },
  medium: { h1: 36, h2: 28, h3: 22, h4: 18 },
  large: { h1: 44, h2: 34, h3: 26, h4: 20 },
  xlarge: { h1: 52, h2: 40, h3: 30, h4: 22 },
};

export const LINE_HEIGHT_VALUE: Record<string, number> = {
  compact: 1.3,
  normal: 1.6,
  relaxed: 1.9,
};

export const PARAGRAPH_WIDTH_PX: Record<string, number> = {
  compact: 480,
  standard: 620,
  wide: 760,
};

export const FONT_WEIGHTS = [
  { value: "300", label: "Light" },
  { value: "400", label: "Regular" },
  { value: "500", label: "Medium" },
  { value: "600", label: "Semi Bold" },
  { value: "700", label: "Bold" },
  { value: "800", label: "Extra Bold" },
];

export const DEFAULT_RADIUS_TOKENS: RadiusTokens = {
  style: "soft",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  pill: "999px",
};

export const DEFAULT_SHADOW_TOKENS: ShadowTokens = {
  level: "2",
  sm: "0 4px 12px rgba(15,23,42,.06)",
  md: "0 12px 32px rgba(15,23,42,.10)",
  lg: "0 24px 64px rgba(15,23,42,.14)",
};

export const DEFAULT_BUTTON_TOKENS: ButtonTokens = {
  radius: "999px",
  size: "medium",
  primaryStyle: "solid",
  secondaryStyle: "outline",
  hoverEffect: "lift",
  fontWeight: "600",
};

export const DEFAULT_BRANDING_TOKENS: BrandingTokens = {
  logoLight: "",
  logoDark: "",
  favicon: "",
  brandName: "Naturino",
  tagline: "Premium Pet Food Export",
};

export const RADIUS_STYLE_PX: Record<string, string> = {
  sharp: "0px",
  soft: "8px",
  rounded: "16px",
  modern: "24px",
  pill: "999px",
};

export const SHADOW_LEVEL_VALUE: Record<string, string> = {
  "0": "none",
  "1": "0 2px 6px rgba(15,23,42,.05)",
  "2": "0 12px 32px rgba(15,23,42,.10)",
  "3": "0 20px 48px rgba(15,23,42,.14)",
  "4": "0 28px 64px rgba(15,23,42,.18)",
};

export const DEFAULT_LAYOUT_TOKENS: LayoutTokens = {
  containerWidth: "1400",
  sectionSpacing: "comfortable",
  gridGap: "24",
  cardGap: "24",
  maxContentWidth: "standard",
};

export const DEFAULT_ANIMATION_TOKENS: AnimationTokens = {
  hoverAnimation: true,
  cardHover: true,
  buttonHover: true,
  scrollReveal: true,
  fadeIn: true,
  speed: "medium",
};

export const SECTION_SPACING_PX: Record<string, number> = {
  compact: 48,
  comfortable: 80,
  spacious: 120,
};

export const MAX_CONTENT_WIDTH_PX: Record<string, number> = {
  narrow: 960,
  standard: 1200,
  wide: 1400,
};

export const ANIMATION_SPEED_MS: Record<string, number> = {
  slow: 500,
  medium: 300,
  fast: 150,
};
