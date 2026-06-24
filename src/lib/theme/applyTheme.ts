import { parseTokens, type Theme } from "../../types/theme";
import { DEFAULT_COLOR_TOKENS, DEFAULT_RADIUS_TOKENS, DEFAULT_SHADOW_TOKENS, RADIUS_STYLE_PX, SHADOW_LEVEL_VALUE } from "./defaults";

export function applyTheme(theme: Theme) {
  const colors = parseTokens(theme.colorTokensJson, DEFAULT_COLOR_TOKENS);
  const radius = parseTokens(theme.radiusTokensJson, DEFAULT_RADIUS_TOKENS);
  const shadow = parseTokens(theme.shadowTokensJson, DEFAULT_SHADOW_TOKENS);

  const root = document.documentElement.style;
  root.setProperty("--rt-brand-primary", colors.brand.primary);
  root.setProperty("--rt-brand-secondary", colors.brand.secondary);
  root.setProperty("--rt-accent", colors.brand.accent);
  root.setProperty("--rt-surface-bg", colors.surface.background);
  root.setProperty("--rt-surface-card", colors.surface.card);
  root.setProperty("--rt-text-heading", colors.text.heading);
  root.setProperty("--rt-text-body", colors.text.body);
  root.setProperty("--rt-radius-lg", RADIUS_STYLE_PX[radius.style] ?? radius.lg);
  root.setProperty("--rt-shadow-md", SHADOW_LEVEL_VALUE[shadow.level] ?? shadow.md);
  root.setProperty("--rt-font-heading", `${theme.fontHeading}, sans-serif`);
  root.setProperty("--rt-font-body", `${theme.fontBody}, sans-serif`);
}
