export interface ColorTokens {
  brand: { primary: string; secondary: string; accent: string; success: string; warning: string; error: string };
  surface: { background: string; card: string; muted: string; border: string; hover: string };
  text: { heading: string; body: string; muted: string; inverse: string };
}

export interface TypographyTokens {
  fontScale: "small" | "medium" | "large" | "xlarge";
  headingWeight: string;
  bodyWeight: string;
  lineHeight: "compact" | "normal" | "relaxed";
  letterSpacing: number;
  paragraphWidth: "compact" | "standard" | "wide";
  textTransform: "none" | "uppercase" | "capitalize" | "lowercase";
  fontSmoothing: boolean;
  renderingMode: "auto" | "sharp" | "smooth";
  wordSpacing: number;
  charSpacing: number;
}

export interface RadiusTokens {
  style: "sharp" | "soft" | "rounded" | "modern" | "pill";
  sm: string;
  md: string;
  lg: string;
  xl: string;
  pill: string;
}

export interface ShadowTokens {
  level: "0" | "1" | "2" | "3" | "4" | string;
  sm: string;
  md: string;
  lg: string;
}

export interface ButtonTokens {
  radius: string;
  size: "small" | "medium" | "large";
  primaryStyle: "solid" | "outline" | "soft" | "ghost";
  secondaryStyle: "solid" | "outline" | "soft" | "ghost";
  hoverEffect: "none" | "lift" | "glow" | "scale";
  fontWeight: string;
}

export interface BrandingTokens {
  logoLight: string;
  logoDark: string;
  favicon: string;
  brandName: string;
  tagline: string;
}

export interface LayoutTokens {
  containerWidth: "1200" | "1320" | "1400" | "1536";
  sectionSpacing: "compact" | "comfortable" | "spacious";
  gridGap: "16" | "24" | "32";
  cardGap: "16" | "24" | "32";
  maxContentWidth: "narrow" | "standard" | "wide";
}

export interface AnimationTokens {
  hoverAnimation: boolean;
  cardHover: boolean;
  buttonHover: boolean;
  scrollReveal: boolean;
  fadeIn: boolean;
  speed: "slow" | "medium" | "fast";
}

export type AppearanceMode = "light" | "dark" | "auto";

export interface Theme {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  version: string;
  isActive: boolean;
  isDarkMode: boolean;
  appearanceMode: AppearanceMode;
  fontHeading: string;
  fontBody: string;
  colorTokensJson: string;
  typographyTokensJson: string;
  radiusTokensJson: string;
  shadowTokensJson: string;
  buttonTokensJson: string;
  brandingTokensJson: string;
  layoutTokensJson: string;
  animationTokensJson: string;
  customCss: string;
  createdAt: string;
  updatedAt: string;
}

export interface ThemeFormValues {
  name: string;
  slug?: string;
  description?: string;
  version: string;
  appearanceMode: AppearanceMode;
  fontHeading: string;
  fontBody: string;
  colorTokensJson: string;
  typographyTokensJson: string;
  radiusTokensJson: string;
  shadowTokensJson: string;
  buttonTokensJson: string;
  brandingTokensJson: string;
  layoutTokensJson: string;
  animationTokensJson: string;
  customCss: string;
}

export function parseTokens<T>(json: string, fallback: T): T {
  try {
    return { ...fallback, ...JSON.parse(json) } as T;
  } catch {
    return fallback;
  }
}
